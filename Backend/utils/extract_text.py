from langchain_pymupdf4llm import PyMuPDF4LLMLoader

# Function to extract text from a PDF file
def extract_text_from_pdf(file_path: str):
    # Initialize the PDF loader with the given file path and mode
    loader = PyMuPDF4LLMLoader(file_path=file_path, mode="single")
    # Load the documents (pages) from the PDF
    documents = loader.load()

    # Check if no documents were loaded or all pages are empty
    if not documents or all(not doc.page_content.strip() for doc in documents):
        raise ValueError(
            "Text could not be extracted from the PDF. It might be corrupted or empty."
        )

    # Return the list of document objects with extracted text
    return documents
