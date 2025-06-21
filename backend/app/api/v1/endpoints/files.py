from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from typing import List
from app.services.s3_service import S3Service
from app.schemas.file import FileResponse as FileResponseSchema

router = APIRouter()
s3_service = S3Service()

@router.post("/upload", response_model=FileResponseSchema)
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a file to S3 storage
    """
    try:
        file_url = await s3_service.upload_file(file)
        return {
            "filename": file.filename.strip(),
            "url": file_url,
            "content_type": file.content_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search", response_model=List[FileResponseSchema])
async def search_files(query: str="", page: int = 1, size: int = 10):
    """
    List all files in the S3 bucket
    """
    try:
        files = await s3_service.list_files()
        return files
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{file_key}")
async def download_file(file_key: str):
    """
    Download a file from S3 storage
    """
    try:
        file_data = await s3_service.download_file(file_key)
        return FileResponse(
            file_data,
            media_type="application/octet-stream",
            filename=file_key
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail="File not found")

@router.delete("/{file_key}")
async def delete_file(file_key: str):
    """
    Delete a file from S3 storage
    """
    try:
        await s3_service.delete_file(file_key)
        return {"message": "File deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=404, detail="File not found")



@router.get("/{file_id}")
async def get_file(file_id: str):
    try:
        return await s3_service.get_file_metadata(file_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail="File not found")

@router.delete("/{file_id}")
async def delete_file_index(file_id: str):
    try:
        await s3_service.delete_index(file_id)
        return {"message": "File deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
    