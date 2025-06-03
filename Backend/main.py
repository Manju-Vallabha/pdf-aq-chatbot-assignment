from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from utils.extract_text import extract_text_from_pdf
from utils.node_processor import process_and_store_nodes
from utils.vector_store import get_or_create_collection
from utils.llm_handler import get_llm_response
from startup import get_embedding_model, get_chroma_client
import os

# Create a FastAPI application instance
app = FastAPI()

# Add CORS middleware to allow frontend (e.g., React app) to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow requests from this origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize global resources for embeddings and vector database
embedding_model = get_embedding_model()
chroma_client = get_chroma_client()
UPLOAD_FOLDER = "tmp/uploads"  # Directory to store uploaded files
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Create directory if it doesn't exist


@app.post("/upload_pdf")
async def upload_pdf(file: UploadFile = File(...), uuid: str = Form(...)):
    """
    Endpoint to upload a PDF file.
    - Saves the file to disk.
    - Extracts text from the PDF.
    - Processes and stores text embeddings in the vector database.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    file_id = f"{uuid}_{file.filename}"  # Unique file identifier
    file_path = os.path.join(UPLOAD_FOLDER, file_id)
    try:
        # Save the uploaded PDF file in chunks (to handle large files)
        with open(file_path, "wb") as f:
            while content := await file.read(1024 * 1024):  # 1MB chunks
                f.write(content)

        # Extract text from the PDF file
        documents = extract_text_from_pdf(file_path)
        # Get or create a vector store (collection) for this user
        vector_store = get_or_create_collection(chroma_client, uuid)
        # Process the extracted text and store embeddings in the vector store
        node_count = process_and_store_nodes(
            documents, vector_store, embedding_model, file.filename, uuid
        )

        return {
            "message": f"PDF {file.filename} processed and stored for UUID {uuid}",
            "filename": file.filename,
            "page_count": len(documents),
            "status": "success",
        }
    except HTTPException:
        raise
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")


@app.post("/ask_question")
async def ask_question(question: str = Form(...), uuid: str = Form(...)):
    """
    Endpoint to answer a user's question based on their uploaded PDFs.
    - Retrieves the user's vector store.
    - Uses an LLM to generate an answer based on relevant PDF content.
    """
    try:
        # Get the user's vector store (collection)
        vector_store = get_or_create_collection(chroma_client, uuid)
        # Get the LLM's response using the question and stored embeddings
        response = get_llm_response(question, vector_store, embedding_model, uuid)
        return {
            "question": question,
            "answer": response["answer"],
            "metadata": response["metadata"],
        }
    except Exception as e:
        # Handle errors during question answering
        raise HTTPException(
            status_code=500, detail=f"Error answering question: {str(e)}"
        )


@app.get("/")
async def root():
    """
    Root endpoint to check if the API is running.
    """
    return {"message": "PDF Chatbot API"}
