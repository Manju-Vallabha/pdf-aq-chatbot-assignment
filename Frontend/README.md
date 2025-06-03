# PDF Chatbot Frontend

## Overview
The frontend of the PDF Chatbot application is built with **React.js**, providing an intuitive interface for users to upload PDF documents, ask questions, and view AI-generated responses. It communicates with the FastAPI backend to process PDFs and answer questions. The UI aligns with the provided Figma design, ensuring usability and responsiveness.

## Features
- **PDF Upload**: Users can upload PDFs via a file input, with validation for PDF files.
- **Question Input**: A chat-style input field for submitting questions.
- **Chat Display**: Shows user questions and AI responses with markdown support.
- **Feedback Modals**: Displays processing status, success, or error messages.
- **Session Management**: Uses `sessionStorage` to store a UUID for persistent document querying.
- **Confirmation Popup**: Warns users before clearing the uploaded file and chat history.

## Main Files
This section lists the primary files in the project, their roles, and locations, mirroring the style of the provided example.

-  `index.html`: The HTML entry point, contains the root div for React rendering.
-  `main.jsx`: React entry point, renders the `App` component into the root div.
-  `App.jsx`: Main app logic, manages state for messages, file uploads, modals, and overall layout.
-  `Header.jsx`: Handles PDF upload, file state, and triggers modals for user feedback.
-  `ChatArea.jsx`: Displays chat messages, supports markdown for AI responses using `react-markdown`.
-  `MessageInput.jsx`: Input field for sending messages, handles API calls to the backend for question answering.
-  `index.css`: Tailwind CSS imports and base styles for the application.
-  `vite.config.js`: Vite configuration, includes React and Tailwind plugins for development and build.
-  `eslint.config.js`: ESLint configuration for code quality and linting rules.


## Installation
### Prerequisites
- **Node.js** (v16 or higher) and **npm**.
- A running backend server at `http://127.0.0.1:8000` (see backend README).

### Steps
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   *Dependencies*: `react`, `react-dom`, `react-markdown`, `remark-gfm`, `react-icons`.
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend runs at `http://localhost:5173`.
4. Ensure the backend is running to handle API requests.

## Usage
1. **Upload a PDF**:
   - Click the "Upload PDF" button in the header.
   - Select a PDF file. A modal shows processing status, followed by success or error.
   - The uploaded file’s name appears in the header.
2. **Ask Questions**:
   - Type a question in the input field at the bottom.
   - Press Enter or click the send button to submit.
   - View the question and AI response in the chat area.
3. **Clear Session**:
   - Click the remove button next to the file name.
   - Confirm via the popup to clear the file and chat history.

## Project Structure
```
frontend/
├── src/
│   ├── App.jsx               # Main component managing state and layout
│   ├── components/
│   │   ├── Header.jsx        # Header with logo, upload button, and file display
│   │   ├── ChatArea.jsx      # Displays chat messages with markdown rendering
│   │   ├── MessageInput.jsx  # Input field for questions
│   ├── assets/
│   │   ├── logo.svg          # Application logo
│   │   ├── profile-logo.png  # AI avatar for chat responses
├── package.json              # Dependencies and scripts
├── README.md                 # This file
```

## Notes
- The frontend uses `react-markdown` with `remark-gfm` for rendering AI responses.
- CORS is configured to allow communication with `http://127.0.0.1:8000`.
- Error handling ensures user-friendly feedback for invalid files or API failures.
- The UI is responsive and matches the Figma design for usability.
