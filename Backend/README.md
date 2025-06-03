# PDF Chatbot Backend

## Overview
The backend of the PDF Chatbot application is built with **FastAPI**, handling PDF uploads, text extraction, embedding storage, and question answering. It integrates **LangChain** and **LlamaIndex** for text processing, **ChromaDB** for vector storage, and the **Together API** for NLP responses using the `meta-llama/Llama-3.3-70B-Instruct-Turbo-Free` model.

## Features
- **PDF Upload**: Saves uploaded PDFs and extracts text using `PyMuPDF`.
- **Text Processing**: Converts text into semantic chunks and generates embeddings with `sentence-transformers/all-MiniLM-L6-v2`.
- **Vector Storage**: Stores embeddings in ChromaDB with UUID-based filtering.
- **Question Answering**: Retrieves relevant chunks and generates context-based answers via the Together API.
- **Error Handling**: Validates PDFs and handles processing errors.

## Installation
### Prerequisites
- **Python** (3.8 or higher) and **pip**.
- **ChromaDB** for vector storage.
- **Together API** key (set as `TOGETHER_API_KEY`).
- A running frontend at `http://localhost:5173` (optional for testing).

### Steps
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *Dependencies*: `fastapi`, `uvicorn`, `langchain-pymupdf4llm`, `llama-index`, `chromadb`, `together`, `sentence-transformers`.
4. Set the Together API key:
   ```bash
   export TOGETHER_API_KEY=<your-api-key>  # On Windows: set TOGETHER_API_KEY=<your-api-key>
   ```
5. Run the FastAPI server:
   ```bash
   uvicorn main:app --host 127.0.0.1 --port 8000
   ```

## Usage
1. **Upload a PDF**:
   - Send a `POST` request to `/upload_pdf` with `file` (PDF) and `uuid` (string).
   - The backend saves the file in `tmp/uploads`, extracts text, and stores embeddings in ChromaDB.
2. **Ask Questions**:
   - Send a `POST` request to `/ask_question` with `question` (string) and `uuid` (string).
   - The backend retrieves relevant chunks, queries the LLM, and returns the answer.
3. **Testing**:
   - Use the frontend or tools like Postman to interact with the API.
   - Example: Upload a PDF and query its content (e.g., “What is machine learning?”).

## API Endpoints
- **POST /upload_pdf**:
  - **Request**: `multipart/form-data` with `file` (PDF), `uuid` (string).
  - **Response**: `{ "message": string, "filename": string, "page_count": int, "status": string }`.
- **POST /ask_question**:
  - **Request**: `multipart/form-data` with `question` (string), `uuid` (string).
  - **Response**: `{ "question": string, "answer": string, "metadata": array }`.

## Project Structure
```
backend/
├── main.py                # FastAPI server and endpoints
├── utils/
│   ├── extract_text.py    # PDF text extraction with PyMuPDF
│   ├── node_processor.py  # Semantic chunking and embedding with LlamaIndex
│   ├── vector_store.py    # ChromaDB vector storage
│   ├── llm_handler.py     # LLM response generation via Together API
│   ├── prompt_template.py # Prompt formatting for LLM
│   ├── pdf_processing.py  # Text chunking utilities
│   ├── startup.py         # Embedding model and ChromaDB setup
├── tmp/uploads/           # Directory for uploaded PDFs
├── requirements.txt       # Dependencies
├── README.md              # This file
```

## Notes
- PDFs are stored in `tmp/uploads`; consider cloud storage for production.
- Embeddings are persisted in `/app/chroma_storage`.
- The backend enforces UUID-based filtering to ensure user-specific data isolation.
- Error handling includes checks for invalid PDFs and API failures.
