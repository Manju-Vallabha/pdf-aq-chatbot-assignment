from llama_index.vector_stores.chroma import ChromaVectorStore

# Cache for vector stores to avoid recreating per request
vector_stores = (
    {}
)  # Dictionary to store and reuse vector store instances by collection name


def get_or_create_collection(chroma_client, uuid: str):
    """
    Get or create a Chroma collection for a UUID.

    This function checks if a vector store for the given user UUID already exists in the cache.
    If it does not exist, it creates a new Chroma collection and wraps it in a ChromaVectorStore.
    The vector store is then cached for future use.
    """
    collection_name = f"user_{uuid}"  # Create a unique collection name for each user
    if collection_name not in vector_stores:
        # Create a new collection if it doesn't exist
        collection = chroma_client.get_or_create_collection(collection_name)
        # Wrap the collection in a ChromaVectorStore
        vector_store = ChromaVectorStore(chroma_collection=collection)
        # Cache the vector store for future requests
        vector_stores[collection_name] = vector_store
    # Return the cached or newly created vector store
    return vector_stores[collection_name]
