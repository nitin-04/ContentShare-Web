import { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaExternalLinkAlt } from "react-icons/fa";
import { BASE_URL } from "../utils/constants";

const ViewPage = () => {
    const { id } = useParams();
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true); 

        axios.get(`${BASE_URL}/view/${id}`)
            .then(res => {
                setContent(res.data); 
                setLoading(false); 

            })
            .catch(() => {
                setContent(null); 
                setLoading(false); 
            });
    }, [id]);


    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-700 text-white rounded-lg shadow-lg text-center my-10">
            {loading ? (
                <p className="text-gray-300">Loading...</p> 
            ) : content ? (
                <div >
                    <p className="text-lg font-semibold mb-6"> View Content </p>
                    <a
                        href={`${content.url}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                        onClick={()=>navigate("/")}>
                        Open File <FaExternalLinkAlt className="ml-2" />
                    </a>
                </div>
            ) : (
                <p className="text-gray-300">Content not found</p> 
            )}
        </div>
    );
};

export default ViewPage;
