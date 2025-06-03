import { useState } from "react";
import { LuSendHorizontal } from "react-icons/lu";

/**
 * MessageInput component for sending user messages and displaying AI responses.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Function} props.addMessage - Callback to add a new message to the chat.
 *   Should accept (message: string, sender: "user" | "ai").
 *
 * @description
 * This component provides an input field and send button for users to type and send messages.
 * When a message is sent, it is added to the chat as a user message, and a POST request is made
 * to the backend to get an AI-generated response, which is then displayed in the chat.
 *
 * - Uses React state to manage the input value and loading state.
 * - Disables input and button while waiting for a response.
 * - Handles errors such as missing session or network issues.
 * - Shows a loading spinner while waiting for the AI response.
 * - Sends message on Enter key press or button click.
 *
 * @example
 * <MessageInput addMessage={(msg, sender) => { ... }} />
 *
 * @internshipAssignment
 * - Demonstrates handling of asynchronous API calls in React.
 * - Shows how to manage UI state (loading, input) and error handling.
 * - Good example of integrating frontend with a backend API for chat functionality.
 */
function MessageInput({ addMessage }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const uuid = sessionStorage.getItem("uuid");
    if (!uuid) {
      addMessage("Error: No session found. Please upload a PDF first.", "ai");
      return;
    }

    addMessage(input, "user");
    const userMessage = input;
    setInput("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("question", userMessage);
      formData.append("uuid", uuid);

      const response = await fetch("http://127.0.0.1:8000/ask_question", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        addMessage(result.answer, "ai");
      } else {
        const errorData = await response.json();
        addMessage(
          `Error: ${errorData.detail || "Failed to get response"}`,
          "ai"
        );
      }
    } catch (error) {
      addMessage(`Error: ${error.message || "Failed to fetch"}`, "ai");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSend();
    }
  };

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 md:px-10 pb-12">
      <div className="w-full max-w-4xl flex items-center bg-white border border-gray-300 rounded-2xl px-4 py-2 sm:py-3 shadow-md">
        <input
          type="text"
          placeholder="Send a message..."
          className="flex-1 bg-transparent outline-none text-base sm:text-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          className={`text-2xl px-2 ${
            isLoading
              ? "text-gray-400 cursor-not-allowed"
              : "hover:text-green-600"
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-6 w-6 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <LuSendHorizontal />
          )}
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
