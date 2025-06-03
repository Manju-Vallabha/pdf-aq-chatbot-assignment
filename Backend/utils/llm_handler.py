from utils.node_processor import (
    retrieve_nodes,
)  # Import function to retrieve relevant document nodes
from utils.prompt_template import (
    get_prompt_template,
)  # Import function to get the prompt template
from together import Together  # Import Together API client


def get_llm_response(question: str, vector_store, embed_model, uuid: str):
    """
    Retrieve relevant documents and generate an LLM response using Together API.

    Args:
        question: User's question
        vector_store: ChromaVectorStore instance
        embed_model: HuggingFaceEmbedding model
        uuid: Unique identifier for filtering
    Returns:
        Dictionary with answer and metadata
    """
    try:
        # Step 1: Retrieve relevant nodes (document chunks) based on the user's question
        nodes = retrieve_nodes(question, vector_store, embed_model, uuid, top_k=2)

        # Step 2: Combine the text from the retrieved nodes to form the context for the LLM
        context = "\n".join([node.text for node in nodes])

        # Step 3: Format the prompt using a template, inserting the context and question
        prompt = get_prompt_template().format(context=context, question=question)
        print(f"[+] Generated prompt: {prompt}")

        # Step 4: Initialize the Together API client for LLM interaction
        client = Together()

        # Step 5: Send the prompt to the LLM using the Together API, with system instructions
        response = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
            messages=[
                {
                    "role": "system",
                    "content": """You are a helpful and knowledgeable assistant designed to answer user questions based solely on the content of uploaded PDF documents.

Your responsibilities:
- Respond accurately using only the context extracted from the document.
- If the context does not contain enough information to answer a question, respond with: "The answer is not available in the provided context."
- Maintain a professional, clear, and concise tone.
- Politely greet the user if they greet you (e.g., "Hello!", "Hi!", "Good morning!").

Constraints:
- Do not make up information that is not present in the document.
- Do not use prior knowledge or assumptions—always rely on the provided context.

Your goal is to assist users in understanding the content of their documents with reliable and context-based answers.
""",
                },
                {"role": "user", "content": prompt},
            ],
            stream=True,  # Enable streaming for real-time response
        )

        # Step 6: Collect the streaming response from the LLM token by token
        answer = ""
        for token in response:
            if hasattr(token, "choices"):
                content = token.choices[0].delta.content
                if content:
                    answer += content

        # Step 7: Return the answer and metadata (e.g., source info) of the retrieved nodes
        return {"answer": answer.strip(), "metadata": [node.metadata for node in nodes]}
    except Exception as e:
        # Handle and raise exceptions with a descriptive error message
        raise Exception(f"Error generating LLM response: {str(e)}")
