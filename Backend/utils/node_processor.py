from llama_index.core import Settings, VectorStoreIndex, StorageContext
from llama_index.core.node_parser import SemanticSplitterNodeParser
from llama_index.core.schema import Document
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.vector_stores.types import (
    MetadataFilters,
    MetadataFilter,
)  # Added for filtering


# Function to process documents, split into nodes, embed, and store in vector DB
def process_and_store_nodes(
    documents, vector_store, embed_model, filename: str, uuid: str
):
    """
    Convert extracted text to nodes, generate embeddings, and store in ChromaDB.

    Args:
        documents: List of LangChain Document objects
        vector_store: ChromaVectorStore instance
        embed_model: HuggingFaceEmbedding model
        filename: Name of the uploaded PDF
        uuid: Unique identifier
    Returns:
        Number of nodes processed
    """
    try:
        # Convert LangChain documents to LlamaIndex documents
        # Each document gets metadata for source, uuid, and page number
        llama_documents = [
            Document(
                text=doc.page_content,
                metadata={
                    "source": filename,
                    "uuid": str(uuid),
                    "page": doc.metadata.get("page", 1),
                },
            )
            for doc in documents
        ]

        # Split documents into semantic chunks (nodes) using the embedding model
        parser = SemanticSplitterNodeParser(embed_model=embed_model)
        nodes = parser.get_nodes_from_documents(llama_documents)

        # Print out each chunk for debugging/inspection
        for i, node in enumerate(nodes):
            print(f"--- Chunk {i+1} ---")
            # print("Text:", node.text)
            # print("Metadata:", node.metadata)

        # Store the nodes (chunks) in the Chroma vector database
        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        index = VectorStoreIndex(
            nodes, storage_context=storage_context, embed_model=embed_model
        )

        return len(nodes)  # Return how many nodes were processed
    except Exception as e:
        raise Exception(f"Error processing and storing nodes: {str(e)}")


# Function to retrieve relevant nodes from the vector DB given a query and uuid filter
def retrieve_nodes(query: str, vector_store, embed_model, uuid: str, top_k: int = 2):
    """
    Retrieve top matching nodes from ChromaDB for a query with UUID filter.

    Args:
        query: User's question
        vector_store: ChromaVectorStore instance
        embed_model: HuggingFaceEmbedding model
        uuid: Unique identifier for filtering
        top_k: Number of top results to retrieve
    Returns:
        List of retrieved nodes
    """
    try:
        # Load the index from the vector store using the embedding model
        index = VectorStoreIndex.from_vector_store(
            vector_store, embed_model=embed_model
        )

        # Create a filter so only nodes with the matching uuid are retrieved
        metadata_filters = MetadataFilters(
            filters=[
                MetadataFilter(key="uuid", value=str(uuid), operator="==")
            ]  # Only get nodes for this uuid
        )

        # Create a retriever object with similarity search and the filter
        retriever = index.as_retriever(similarity_top_k=top_k, filters=metadata_filters)

        # Retrieve the most relevant nodes for the query
        results = retriever.retrieve(query)

        # Print out retrieved chunks for inspection
        print("\n--- Retrieved Chunks ---")
        for i, node in enumerate(results):
            print(f"\nChunk {i+1}:")
            # print(node.text)
            # print("Metadata:", node.metadata)

        return results  # Return the retrieved nodes
    except Exception as e:
        raise Exception(f"Error retrieving nodes: {str(e)}")
