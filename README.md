# FileVerse

FileVerse is an intelligent file management system that combines a modern Angular frontend with a FastAPI backend, providing a seamless file upload and management experience.

## Features

- 🚀 Modern Angular 17 frontend with standalone components
- ⚡ FastAPI backend with async support
- 📁 Drag-and-drop file upload
- 🔍 Intelligent file search and organization
- 🎨 Beautiful and responsive UI
- 🔒 Secure file handling

## Project Structure

```
fileverse/
├── frontend-new/          # Angular frontend application
│   ├── src/
│   │   ├── app/          # Application components
│   │   ├── assets/       # Static assets
│   │   └── environments/ # Environment configurations
│   └── package.json      # Frontend dependencies
│
└── backend/              # FastAPI backend application
    ├── app/             # Backend application code
    ├── tests/           # Test files
    └── pyproject.toml   # Python dependencies
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- uv (Python package manager)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install uv if not already installed:
   ```bash
   pip install uv
   ```

4. Install dependencies:
   ```bash
   uv pip install -e .
   ```

5. Start the backend server:
   ```bash
   python main.py
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend-new
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

The frontend will be available at `http://localhost:4200`

## Development

### Backend Development

- The backend uses FastAPI for high-performance API endpoints
- File uploads are handled asynchronously
- Search functionality is implemented using FastAPI's query parameters
- File metadata is stored and managed efficiently

### Frontend Development

- Built with Angular 17 using standalone components
- Features a modern, responsive UI with drag-and-drop functionality
- Uses Angular's HttpClient for API communication
- Implements progress tracking for file uploads

## API Endpoints

- `POST /files/upload` - Upload a file
- `GET /files/search` - Search files
- `GET /files/{file_id}` - Get file metadata
- `DELETE /files/{file_id}` - Delete a file

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Angular team for the amazing framework
- FastAPI for the high-performance backend framework
- All contributors who have helped shape this project

