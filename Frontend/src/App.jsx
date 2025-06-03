import { useState, useEffect } from "react";
import Header from "./components/Header";
import ChatArea from "./components/ChatArea";
import MessageInput from "./components/MessageInput";
import { IoClose } from "react-icons/io5";

/**
 * Main application component for the PDF chat interface.
 *
 * @component
 *
 * @description
 * This is the root component of the app. It manages the overall state for chat messages,
 * file uploads, modal dialogs, and warning popups. The component coordinates the flow
 * between uploading a PDF, displaying processing status, and enabling chat with an AI
 * based on the uploaded document.
 *
 * ## State Variables:
 * - `messages`: Array of chat messages between the user and the AI.
 * - `file`: The currently uploaded PDF file (if any).
 * - `showModal`: Controls visibility of the modal dialog (e.g., during PDF processing).
 * - `modalMessage`: Message displayed inside the modal dialog.
 * - `showWarning`: Controls visibility of the warning popup for clearing chat/file.
 * - `localFile`: Stores the local file object for upload preview or processing.
 *
 * ## Key Features:
 * - **Modal Dialog**: Shows status messages (e.g., "Processing your PDF...") and auto-closes after a timeout.
 * - **Warning Popup**: Asks for user confirmation before clearing chat history and uploaded file.
 * - **Chat Area**: Displays the conversation between the user and the AI.
 * - **Message Input**: Allows the user to send new messages.
 * - **Header**: Handles file upload and triggers modal/warning dialogs.
 *
 * ## Usage in Internship Assignment:
 * - Demonstrates state management using React hooks (`useState`, `useEffect`).
 * - Shows how to implement modal and popup dialogs for user feedback and confirmation.
 * - Illustrates separation of concerns by delegating UI sections to child components (`Header`, `ChatArea`, `MessageInput`).
 * - Provides a pattern for handling file uploads and chat history in a single-page React app.
 *
 * @returns {JSX.Element} The rendered application UI.
 */
function App() {
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("Processing your PDF...");
  const [showWarning, setShowWarning] = useState(false);
  const [localFile, setLocalFile] = useState(null);

  // Auto-close modal for success or any message after a timeout
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(
        () => {
          setShowModal(false);
        },
        modalMessage.includes("Now you can chat with the AI") ? 5000 : 3000
      );
      return () => clearTimeout(timer);
    }
  }, [showModal, modalMessage]);

  const addMessage = (text, sender) => {
    setMessages((prevMessages) => [...prevMessages, { text, sender }]);
  };

  const handleClearFileAndHistory = () => {
    setFile(null);
    setLocalFile(null);
    setMessages([]);
    sessionStorage.removeItem("uuid"); // Clear UUID without generating a new one
    // Debug: Confirm UUID cleared
    setShowWarning(false);
  };

  return (
    <>
      <div
        className={
          showModal || showWarning ? "blur-sm pointer-events-none" : ""
        }
      >
        <div className="flex flex-col h-screen font-sans">
          <Header
            setFile={setFile}
            setShowModal={setShowModal}
            setModalMessage={setModalMessage}
            setShowWarning={setShowWarning}
            localFile={localFile}
            setLocalFile={setLocalFile}
          />
          <main className="flex-1 overflow-y-auto">
            <ChatArea messages={messages} />
            <div className="h-32"></div>{" "}
            {/* Gap between ChatArea content and MessageInput */}
          </main>
          <div className="fixed bottom-0 left-0 right-0 bg-white z-10">
            <MessageInput addMessage={addMessage} />
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-gray-300 text-center max-w-xs w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
              title="Close"
            >
              <IoClose className="text-xl" />
            </button>
            <img
              src="/profile-logo.png"
              alt="Logo"
              className="mx-auto mb-4 h-12 w-12"
            />
            <p className="text-lg font-medium">{modalMessage}</p>
          </div>
        </div>
      )}

      {/* Warning Popup */}
      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-xs w-full">
            <img
              src="/profile-logo.png"
              alt="Logo"
              className="mx-auto mb-4 h-16 w-16"
            />
            <p className="text-lg font-medium mb-4">
              Are you sure you want to clear the file and chat history?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleClearFileAndHistory}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
