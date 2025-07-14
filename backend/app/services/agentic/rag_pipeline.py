from langchain_mistralai import ChatMistralAI
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.utils.hub import pull
from langgraph.graph import StateGraph
from langchain_text_splitters import RecursiveCharacterTextSplitter
from document_loader import DocumentLoaderFactory
from vector_store import VectorStoreFactory
from embeddings_factory import EmbeddingsFactory
from schemas import RAGConfig, RAGResponse, DocumentLoaderConfig
from typing import List, TypedDict
import time

class RAGPipeline:
    def __init__(self, config: RAGConfig):
        """
        Initialize the RAG pipeline with the given configuration.
        """
        self.config = config
        self.llm = ChatMistralAI(
            model=config.llm.model,
            temperature=config.llm.temperature
        )
        self.embeddings = None  # Initialized in initialize()
        self.vector_store = None
        self.prompt_template = None
        self.graph = None

    async def initialize(self) -> None:
        """
        Initialize the vector store, load documents, and build the graph.
        """
        # Initialize embeddings
        self.embeddings = await EmbeddingsFactory.create_embeddings(self.config.embeddings)

        # Initialize vector store
        self.vector_store = await VectorStoreFactory.create_vector_store(
            self.config.vectorStore, self.embeddings
        )

        # Load and process documents
        await self.load_and_index_documents()

        # Load prompt template
        self.prompt_template = await pull("rlm/rag-prompt")

        # Build the graph
        self._build_graph()

    async def load_and_index_documents(self) -> None:
        """
        Load and index documents into the vector store.
        """
        docs = await DocumentLoaderFactory.load_documents(self.config.documentLoader)
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.config.chunking.chunkSize,
            chunk_overlap=self.config.chunking.chunkOverlap
        )
        all_splits = await splitter.split_documents(docs)
        await self.add_split_documents(all_splits)
        print(f"✅ Indexed {len(all_splits)} document chunks")

    def _build_graph(self) -> None:
        """
        Build the LangGraph for the RAG pipeline.
        """
        # Define state annotations
        class InputState(TypedDict):
            question: str

        class RAGState(TypedDict):
            question: str
            context: List[Document]
            answer: str

        # Define application steps
        async def retrieve(state: InputState) -> dict:
            retrieved_docs = await self.vector_store.similarity_search(state["question"], k=4)
            return {"context": retrieved_docs}

        async def generate(state: RAGState) -> dict:
            docs_content = "\n\n".join(doc.page_content for doc in state["context"])
            messages = await self.prompt_template.invoke({
                "question": state["question"],
                "context": docs_content
            })
            response = await self.llm.invoke(messages)
            return {"answer": response.content}

        # Compile the graph
        self.graph = (
            StateGraph(RAGState)
            .add_node("retrieve", retrieve)
            .add_node("generate", generate)
            .add_edge("__start__", "retrieve")
            .add_edge("retrieve", "generate")
            .add_edge("generate", "__end__")
            .compile()
        )

    async def query(self, question: str) -> RAGResponse:
        """
        Execute a query through the RAG pipeline and return the response.
        """
        start_time = time.time()
        try:
            result = await self.graph.invoke({"question": question})
            processing_time = time.time() - start_time
            return RAGResponse(
                answer=result["answer"],
                context=[doc.page_content for doc in result["context"]],
                metadata={
                    "retrievedDocs": len(result["context"]),
                    "processingTime": processing_time
                }
            )
        except Exception as e:
            raise RuntimeError(f"RAG query failed: {str(e)}")

    async def add_split_documents(self, docs: List[Document]) -> None:
        """
        Add split documents to the vector store.
        """
        await self.vector_store.add_documents(docs)
        print(f"✅ Added {len(docs)} new document chunks")

    async def add_new_documents(self, config: DocumentLoaderConfig) -> None:
        """
        Load and index new documents into the vector store.
        """
        docs = await DocumentLoaderFactory.load_documents(config)
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.config.chunking.chunkSize,
            chunk_overlap=self.config.chunking.chunkOverlap
        )
        all_splits = await splitter.split_documents(docs)
        await self.add_split_documents(all_splits)
        print(f"✅ Added {len(all_splits)} new document chunks")