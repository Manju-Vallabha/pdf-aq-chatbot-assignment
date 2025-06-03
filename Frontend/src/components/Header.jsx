import {
  IoDocumentOutline,
  IoAddCircleOutline,
  IoClose,
} from "react-icons/io5";

/**
 * Header component for the PDF chat application.
 *
 * This component renders the top navigation bar, including the logo,
 * file upload button, and the currently selected PDF file with a remove option.
 * It handles PDF file selection, validation, and uploading to the backend API.
 *
 * ## Key Features:
 * - Allows users to upload a PDF file.
 * - Validates that the selected file is a PDF.
 * - Generates a unique UUID for each upload and stores it in sessionStorage.
 * - Handles file upload to the backend and displays status messages in a modal.
 * - Shows the selected file name and provides a button to remove it and clear chat history.
 *
 * ## Props:
 * @param {function} setFile - Setter for the selected file state in the parent component.
 * @param {function} setShowModal - Setter to control the visibility of the modal dialog.
 * @param {function} setModalMessage - Setter for the message displayed in the modal.
 * @param {function} setShowWarning - Setter to control the visibility of the warning dialog (for file removal).
 * @param {File|null} localFile - The currently selected PDF file, or null if none is selected.
 * @param {function} setLocalFile - Setter for the local file state.
 *
 * ## Usage Notes (for internship assignment):
 * - The file input is hidden and triggered by clicking the "Upload PDF" button.
 * - Only PDF files are accepted; other file types will show an error modal.
 * - On successful upload, the modal displays a success message and the file name.
 * - Removing the file triggers a warning dialog before clearing the file and chat history.
 * - The component uses Tailwind CSS for styling and React Icons for icons.
 * - The backend API endpoint for uploading is hardcoded as "http://127.0.0.1:8000/upload_pdf".
 *
 * @component
 */
function Header({
  setFile,
  setShowModal,
  setModalMessage,
  setShowWarning,
  localFile,
  setLocalFile,
}) {
  const handleFileChange = (event) => {
    const input = event.target;
    const selectedFile = input.files[0];

    if (selectedFile && selectedFile.type === "application/pdf") {
      const newUuid = crypto.randomUUID(); // Generate new UUID for new PDF
      sessionStorage.setItem("uuid", newUuid);

      setLocalFile(selectedFile);
      setFile(selectedFile);
      handleUpload(selectedFile, newUuid);
      input.value = ""; // Reset file input
    } else {
      setModalMessage("Error: Please select a valid PDF file.");
      setShowModal(true);
      setLocalFile(null);
      setFile(null);
      input.value = ""; // Reset file input
    }
  };

  const handleUpload = async (file, uuid) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uuid", uuid);

    // Debug: Log FormData contents

    setShowModal(true);
    setModalMessage("Processing your PDF...");

    try {
      const response = await fetch("http://127.0.0.1:8000/upload_pdf", {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text(); // Debug: Get raw response text

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          throw new Error("Failed to upload PDF: Invalid JSON response");
        }
        throw new Error(errorData.detail || "Failed to upload PDF");
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        throw new Error("Failed to parse API response as JSON");
      }

      if (!result.filename) {
        throw new Error("API response missing 'filename' field");
      }

      const successMessage = `PDF "${result.filename}" processed successfully. Now you can chat with the AI.`;
      setModalMessage(successMessage);
    } catch (error) {
      console.error("Upload Error:", error.message); // Debug: Log the error
      setModalMessage(`Upload error: ${error.message}`);

      setLocalFile(null);
      setFile(null);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shadow-sm">
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        <img src="/logo.svg" alt="AI Planet Logo" className="h-12 w-auto" />
      </div>

      {/* Right Side: file name + remove button + upload button */}
      <div className="flex items-center space-x-4">
        {localFile && (
          <div className="flex items-center space-x-2">
            <div className="p-1 md:p-2 border border-green-400 rounded-md">
              <IoDocumentOutline className="text-green-600 text-base md:text-xl" />
            </div>
            <span className="text-green-600 text-sm md:text-lg font-normal truncate max-w-[120px] md:max-w-none">
              {localFile.name}
            </span>
            <button
              onClick={() => setShowWarning(true)}
              className="text-gray-600 hover:text-red-600"
              title="Remove file and chat history"
            >
              <IoClose className="text-xl md:text-2xl" />
            </button>
          </div>
        )}
        {/* Upload Button */}
        <label className="cursor-pointer border border-black rounded-xl px-3 py-2 flex items-center space-x-2">
          <IoAddCircleOutline className="text-2xl" />
          <span className="hidden md:inline text-base font-medium">
            Upload PDF
          </span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    </header>
  );
}

export default Header;
