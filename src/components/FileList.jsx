import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from 'prop-types';
import { BASE_URL } from "../utils/constants";
import { FaFilePdf, FaFileImage, FaFileVideo, FaFileAlt, FaFilePowerpoint, FaCopy, FaExternalLinkAlt } from "react-icons/fa";

const getFileIcon = (fileType) => {
    if (fileType.includes("pdf")) return <FaFilePdf className="text-red-500 w-12 h-12" />;
    if (fileType.includes("image")) return <FaFileImage className="text-green-500 w-12 h-12" />;
    if (fileType.includes("video")) return <FaFileVideo className="text-blue-500 w-12 h-12" />;
    if (fileType.includes("presentation") || fileType.includes("ppt")) return <FaFilePowerpoint className="text-orange-500 w-12 h-12" />;
    return <FaFileAlt className="text-gray-400 w-12 h-12" />; 
};

const FileList = ({ onContentClick }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedStates, setCopiedStates] = useState({});

    const fetchFiles = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/upload`);
            setUploadedFiles(res.data);
        } catch (error) {
            console.error("Error fetching files:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleShare = (fileUrl, fileId) => {
        navigator.clipboard.writeText(fileUrl);
        setCopiedStates(prev => ({
            ...prev,
            [fileId]: true
        }));
        setTimeout(() => {
            setCopiedStates(prev => ({
                ...prev,
                [fileId]: false
            }));
        }, 2000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-lg">Loading files...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Your Shared Files
                </h2>
                
                {uploadedFiles.length === 0 ? (
                    <div className="text-center py-12 bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50">
                        <p className="text-gray-400 text-xl">No files uploaded yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {uploadedFiles.map((file) => (
                            <div
                                key={file._id}
                                className="group bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="bg-gray-700/50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                                        {getFileIcon(file.fileType)}
                                    </div>
                                    
                                    <div className="text-center w-full">
                                        <h3 className="font-semibold text-lg text-white mb-2 truncate">
                                            {file.filename}
                                        </h3>
                                        <p className="text-sm text-gray-400 mb-4">
                                            {file.fileType} | {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>

                                    <div className="flex gap-3 w-full">
                                        <a
                                            href={`${file.url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/20 transition duration-200"
                                        >
                                            <FaExternalLinkAlt />
                                            View
                                        </a>

                                        <button
                                            onClick={() => handleShare(`${file.url}`, file._id)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/20 transition duration-200"
                                        >
                                            <FaCopy />
                                            {copiedStates[file._id] ? 'Copied!' : 'Share'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

FileList.propTypes = {
    onContentClick: PropTypes.func.isRequired
};

export default FileList;
