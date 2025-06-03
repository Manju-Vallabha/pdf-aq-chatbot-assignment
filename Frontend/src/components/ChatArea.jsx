import { FaUserCircle } from "react-icons/fa"; // Import user icon from react-icons
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown for rendering markdown
import remarkGfm from "remark-gfm"; // Import GitHub Flavored Markdown plugin

// ChatArea component receives 'messages' as a prop
function ChatArea({ messages }) {
  return (
    // Container for the chat area with styling
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6 bg-white px-8 sm:px-10 md:px-12">
      {/* Loop through each message and render it */}
      {messages.map((message, index) => (
        <div key={index} className="flex items-start space-x-4">
          {/* Avatar section */}
          <div className="flex-shrink-0">
            {message.sender === "user" ? (
              // Show user icon if sender is 'user'
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-500">
                <FaUserCircle className="w-10 h-10 text-white" />
              </div>
            ) : (
              // Show AI avatar image if sender is 'ai'
              <img
                src="/profile-logo.png"
                alt="AI Avatar"
                className="w-10 h-10 rounded-full"
              />
            )}
          </div>

          {/* Message content section */}
          <div className="flex-1 text-gray-800 leading-relaxed text-[15px] max-w-3xl">
            {message.sender === "ai" ? (
              // Render AI message as markdown with GitHub Flavored Markdown support
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.text}
                </ReactMarkdown>
              </div>
            ) : (
              // Render user message as plain text
              <div>{message.text}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatArea; // Export the ChatArea component
