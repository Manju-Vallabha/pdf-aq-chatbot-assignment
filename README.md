# PDF Chatbot Application

## Overview
The PDF Chatbot is a full-stack application that allows users to upload PDF documents, process their content, and ask questions about the content using natural language processing (NLP). Built as part of the Fullstack Internship Assignment, it meets all functional and non-functional requirements, including PDF upload, question answering, follow-up questions, intuitive UI, and optimized performance. The application uses React.js for the frontend, FastAPI for the backend, and integrates LangChain, LlamaIndex, and the Together API for NLP processing, with ChromaDB for vector storage.

## Documentation
This section provides links to the official documentation of key technologies used in the project, explaining their relevance to the PDF Chatbot application.

- [SemanticSplitterNodeParser](https://docs.llamaindex.ai/en/v0.10.17/api/llama_index.core.node_parser.SemanticSplitterNodeParser.html): This documentation details the SemanticSplitterNodeParser from LlamaIndex, which is used in node_processor.py to split extracted PDF text into semantically meaningful nodes. These nodes ensure that the text chunks preserve contextual integrity, improving the accuracy of retrieved content for question answering. The parser leverages an embedding model (sentence-transformers/all-MiniLM-L6-v2 in this project) to identify natural breakpoints in the text, a key innovation for enhancing answer quality.

- [PyMuPDF4LLMLoader](https://python.langchain.com/docs/integrations/document_loaders/pymupdf4llm/): This link points to the LangChain documentation for PyMuPDF4LLMLoader, which is utilized in extract_text.py to extract text from uploaded PDFs. PyMuPDF4LLMLoader is chosen for its efficiency and ability to handle complex PDF structures, such as multi-column layouts and tables, ensuring reliable text extraction for downstream processing. This component is critical for providing high-quality text input to the semantic node creation process.

- [together.ai](https://www.together.ai/): This is the official website of Together AI, which provides the API used in llm_handler.py to generate responses. The application uses the meta-llama/Llama-3.3-70B-Instruct-Turbo-Free model via the Together API to answer user questions based on the context extracted from PDFs. The API ensures that responses are generated solely from the provided document context, adhering to the project’s requirement for accurate, context-based answers.

## Innovations
To enhance the application’s functionality and performance, two key innovations were implemented:

1. **SemanticSplitterNodeParser for Intelligent Node Creation**:
   - The application uses `SemanticSplitterNodeParser` from LlamaIndex (`node_processor.py`) to split PDF text into semantically meaningful **nodes**, rather than arbitrary text chunks. These nodes are cohesive text segments (e.g., paragraphs or sentences) that preserve contextual integrity, created using the `sentence-transformers/all-MiniLM-L6-v2` embedding model to identify natural breakpoints. By generating nodes based on semantic similarity, the application ensures that retrieved context during question answering is highly relevant, leading to more accurate and coherent responses from the LLM. Compared to traditional recursive character splitting, this semantic node creation enhances performance and answer quality, directly addressing the assignment’s requirement for optimized processing.

2. **PyMuPDF4LLMLoader for Efficient Text Extraction**:
   - The `PyMuPDF4LLMLoader` from LangChain (`extract_text.py`) is used to extract text from uploaded PDFs. This library is optimized for speed and accuracy, capable of handling complex PDF structures (e.g., multi-column layouts, tables, and embedded images with text). Unlike other libraries that may struggle with formatting or miss content, PyMuPDF ensures robust text extraction, providing high-quality input for node creation and embedding. This choice enhances the application’s reliability and performance, ensuring that even large or intricate PDFs are processed efficiently, aligning with the assignment’s non-functional requirement for performance optimization.

These innovations improve the application’s ability to handle diverse PDFs and deliver precise answers, enhancing both usability and efficiency.

## Architecture
The application follows a client-server architecture:

![Flowchart](images/Cross%20Functional%20Flowchart%20(1).jpg)

1. **Frontend (React.js)**:
   - Built with React components (`App.jsx`, `Header.jsx`, `ChatArea.jsx`, `MessageInput.jsx`).
   - Handles PDF uploads, question input, and displays responses in a chat interface.
   - Uses `sessionStorage` to store a UUID for session persistence.
   - Communicates with the backend via HTTP requests (`/upload_pdf`, `/ask_question`).
2. **Backend (FastAPI)**:
   - Exposes endpoints for PDF upload (`/upload_pdf`) and question answering (`/ask_question`).
   - Extracts text from PDFs using `PyMuPDF` (`extract_text.py`).
   - Processes text into semantic chunks using `LlamaIndex` (`node_processor.py`).
   - Generates embeddings with `sentence-transformers/all-MiniLM-L6-v2` (`startup.py`) and stores them in `ChromaDB` (`vector_store.py`).
   - Queries the `Together API` (Llama-3.3-70B model) for answers (`llm_handler.py`).
3. **Data Flow**:
   - User uploads PDF → Frontend sends to backend → Text extracted and chunked → Embeddings stored in ChromaDB.
   - User asks question → Frontend sends question and UUID → Backend retrieves chunks, queries LLM → Response displayed in frontend.

## Installation
### Prerequisites
- **Node.js** (v16 or higher) and **npm** for the frontend.
- **Python** (3.8 or higher) and **pip** for the backend.
- **ChromaDB** for vector storage.
- **Together API** key for LLM access (set as environment variable `TOGETHER_API_KEY`).
- A modern browser (e.g., Chrome, Firefox).

### Steps
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd pdf-chatbot
   ```

2. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Create a virtual environment and activate it:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows: venv\Scripts\activate
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
     *Note*: Ensure `requirements.txt` includes `fastapi`, `uvicorn`, `langchain-pymupdf4llm`, `llama-index`, `chromadb`, `together`, `sentence-transformers`.
   - Set the Together API key:
     ```bash
     export TOGETHER_API_KEY=<your-api-key>  # On Windows: set TOGETHER_API_KEY=<your-api-key>
     ```
   - Run the FastAPI server:
     ```bash
     uvicorn main:app --host 127.0.0.1 --port 8000
     ```

3. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
     *Note*: Ensure `package.json` includes `react`, `react-dom`, `react-markdown`, `remark-gfm`, `react-icons`.
   - Start the development server:
     ```bash
     npm start
     ```
     The frontend runs at `http://localhost:5173`.

4. **Verify Setup**:
   - Open `http://localhost:5173` in your browser.
   - Upload a PDF and ask a question to confirm functionality.

## Usage
1. **Upload a PDF**:
   - Click the "Upload PDF" button in the header.
   - Select a valid PDF file. A modal shows "Processing your PDF..." and confirms success or displays errors.
2. **Ask Questions**:
   - Type a question in the message input field (e.g., “What is machine learning?”).
   - The question and AI response appear in the chat area.
   - Ask follow-up questions using the same PDF.
3. **Clear Session**:
   - Click the remove button next to the uploaded file’s name.
   - Confirm via the warning popup to clear the file and chat history.

## API Documentation
- **POST /upload_pdf**:
  - **Request**: `multipart/form-data` with `file` (PDF) and `uuid` (string).
  - **Response**: JSON with `message`, `filename`, `page_count`, `status`.
  - **Example**:
    ```json
    {
      "message": "PDF sample.pdf processed and stored for UUID 1234-5678",
      "filename": "sample.pdf",
      "page_count": 5,
      "status": "success"
    }
    ```
- **POST /ask_question**:
  - **Request**: `multipart/form-data` with `question` (string) and `uuid` (string).
  - **Response**: JSON with `question`, `answer`, `metadata`.
  - **Example**:
    ```json
    {
      "question": "What is machine learning?",
      "answer": "Machine learning is a method of data analysis that automates analytical model building.",
      "metadata": [{"source": "sample.pdf", "uuid": "1234-5678", "page": 1}]
    }
    ```

## Assignment Compliance
- **Functional Requirements**:
  - PDF upload and text extraction.
  - Question answering with context from PDFs.
  - Support for follow-up questions via UUID-based session management.
- **Non-Functional Requirements**:
  - **Usability**: Clean UI with modals, error messages, and confirmation popups.
  - **Performance**: Semantic node creation and vector storage optimize response times.
- **Code Quality**: Well-structured, commented code in both frontend and backend.
- **Design**: Frontend aligns with the provided Figma design.
- **Innovation**: Semantic node creation for better context retrieval, robust text extraction with PyMuPDF, and a confirmation popup for session clearing.

## Project Structure
```
pdf-chatbot/
├── backend/
│   ├── main.py                # FastAPI server and endpoints
│   ├── utils/
│   │   ├── extract_text.py    # PDF text extraction
│   │   ├── node_processor.py  # Semantic chunking and embedding
│   │   ├── vector_store.py    # ChromaDB vector storage
│   │   ├── llm_handler.py     # LLM response generation
│   │   ├── prompt_template.py # Prompt formatting
│   │   ├── pdf_processing.py  # Text chunking utilities
│   │   ├── startup.py         # Embedding model and ChromaDB setup
│   ├── tmp/uploads/           # Directory for uploaded PDFs
│   ├── requirements.txt       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── components/
│   │   │   ├── Header.jsx     # Header with upload and file display
│   │   │   ├── ChatArea.jsx   # Chat conversation display
│   │   │   ├── MessageInput.jsx # Question input field
│   ├── package.json           # Frontend dependencies
├── README.md                 # This file
```

## Notes
- Ensure the Together API key is valid and has sufficient quota.
- The backend stores PDFs in `tmp/uploads` and embeddings in `/app/chroma_storage`.
- For production, consider using cloud storage (e.g., AWS S3) instead of local file storage.

For further details, refer to the frontend (`frontend/README.md`) and backend (`backend/README.md`) READMEs.
