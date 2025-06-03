from llama_index.core import Settings

"""
startup.py
This module provides utility functions to initialize and configure the embedding model and ChromaDB client
for use in NLP or information retrieval applications.
Functions:
-----------
get_embedding_model():
    
    Initializes and returns a HuggingFace embedding model using the 'sentence-transformers/all-MiniLM-L6-v2' model.
    - Checks if the embedding model is already loaded in the global Settings to avoid redundant initialization.
    - If not loaded, it loads the model and assigns it to Settings.embed_model.
    - Handles exceptions and prints informative messages for debugging.
    - Returns the embedding model instance.
    # Internship Note:
    # This function ensures that the embedding model is loaded only once, saving memory and computation.
    # It uses the Settings object from llama_index.core to store the model globally.
    
get_chroma_client():
    
    Initializes and returns a ChromaDB client with persistent storage.
    - Sets up a persistent directory at '/app/chroma_storage' to store ChromaDB data.
    - Ensures the directory exists (creates it if necessary).
    - Initializes the ChromaDB client with the specified directory and disables anonymized telemetry.
    - Handles exceptions and prints informative messages for debugging.
    - Returns the ChromaDB client instance.
    # Internship Note:
    # This function abstracts the setup of ChromaDB, making it easy to reuse and maintain.
    # Persistent storage ensures that your database state is saved across application restarts.
    """
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from chromadb.config import Settings as ChromaSettings
import chromadb
import os


def get_embedding_model():
    """Initialize and return the HuggingFace embedding model."""
    model_name = "sentence-transformers/all-MiniLM-L6-v2"

    # Check without triggering default OpenAI embedding
    if Settings.__dict__.get("_embed_model") is None:
        print(f"Loading embedding model: {model_name}")
        try:
            Settings.embed_model = HuggingFaceEmbedding(model_name=model_name)
            print(f"Embedding model {model_name} loaded successfully")
        except Exception as e:
            print(f"Failed to load embedding model: {e}")
            raise
    else:
        print(f"Embedding model already loaded")

    return Settings.embed_model


def get_chroma_client():
    """Initialize and return the ChromaDB client with persistent storage."""
    persist_directory = "/app/chroma_storage"
    try:
        os.makedirs(persist_directory, exist_ok=True)
        client = chromadb.Client(
            ChromaSettings(
                persist_directory=persist_directory, anonymized_telemetry=False
            )
        )
        print(
            f"ChromaDB client initialized with persist_directory: {persist_directory}"
        )
        return client
    except Exception as e:
        print(f"Failed to initialize ChromaDB client: {e}")
        raise
