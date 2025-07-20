import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/UploadResume.css'
import BASE_URL from "../../api.js";
const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [resumePath, setResumePath] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.warn('Please select a file to upload.');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await axios.post(`${BASE_URL}/upload`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(res.data.message);
      setResumePath(res.data.filePath);
    } catch (err) {
      console.error(err);
      toast.error('Upload failed. Please try again.');
    }
  };

  const handleDownload = () => {
    window.open(`${BASE_URL}/download-resume`, '_blank');
  };

  return (
    <div className="container mt-4">
      <h4>📤 Upload Resume (PDF/DOCX only)</h4>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="form-control my-2" />
        <button type="submit" className="btn btn-primary">Upload</button>
      </form>

      {resumePath && (
        <div className="mt-3">
          <p>✅ Resume uploaded.</p>
          <button className="btn btn-success" onClick={handleDownload}>📥 Download Resume</button>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default UploadResume;
