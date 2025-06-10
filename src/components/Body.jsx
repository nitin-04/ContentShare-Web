import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import {
  FaFilePdf,
  FaFilePowerpoint,
  FaFileImage,
  FaVideo,
  FaCloudUploadAlt,
} from "react-icons/fa";

const ContentUploader = () => {
  const [file, setFile] = useState(null);
  const [shareLink, setShareLink] = useState("");
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleAddContent = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      //   setShareLink(`http://localhost:5173/view/${res.data.id}`);
      setShareLink(`https://content-share-web.vercel.app/view/${res.data.id}`);
      setError(null);
    } catch (error) {
      console.error("Upload failed:", error);
      setError(
        error.response ? error.response.data.error : "Unknown error occurred"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-md w-full p-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl text-center border border-gray-700/50">
        <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text ">
          Share Your Content
        </h2>

        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative ${
            dragActive ? "scale-105" : ""
          } transition-all duration-300`}
        >
          <label htmlFor="fileInput" className="block cursor-pointer">
            <div className="flex justify-center space-x-8 my-6 text-6xl">
              <FaFilePdf className="text-red-500 hover:text-red-400 transition duration-200 transform hover:scale-110" />
              <FaFilePowerpoint className="text-orange-500 hover:text-orange-400 transition duration-200 transform hover:scale-110" />
              <FaFileImage className="text-green-500 hover:text-green-400 transition duration-200 transform hover:scale-110" />
              <FaVideo className="text-blue-500 hover:text-blue-400 transition duration-200 transform hover:scale-110" />
            </div>
            <div
              className={`w-full border-3 border-dashed ${
                dragActive
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-500"
              } p-8 rounded-xl text-gray-300 hover:bg-gray-700/50 transition duration-300 flex flex-col items-center gap-4`}
            >
              <FaCloudUploadAlt className="text-4xl text-gray-400" />
              <span className="text-lg font-medium">
                {file ? file.name : "Drag & drop or click to select a file"}
              </span>
              {file && (
                <span className="text-sm text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              )}
            </div>
          </label>
        </div>

        <div className="space-y-4 mt-6">
          <button
            onClick={handleAddContent}
            disabled={isUploading || !file}
            className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-600 active:scale-95 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {isUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </button>

          <button
            onClick={() => navigate("/file-list")}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-600 active:scale-95 transition duration-200"
          >
            View Uploaded Files
          </button>
        </div>

        {shareLink && (
          <div className="mt-6 p-4 bg-gray-700/50 rounded-xl">
            <p className="text-gray-300 mb-2">Share this link:</p>
            <Link
              to={shareLink}
              className="text-blue-400 hover:text-blue-300 underline break-all"
            >
              {shareLink}
            </Link>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400">Error: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentUploader;
