import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/UploadResume.css'; // optional CSS file

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [detectedSkills, setDetectedSkills] = useState([]);
  const [extractedText, setExtractedText] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.warn('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await axios.post('http://localhost:3000/upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(res.data.message || 'Upload successful!');
      setDetectedSkills(res.data.detectedSkills || []);
      setExtractedText(res.data.extractedText || '');
      setSaveStatus('');
    } catch (err) {
      console.error(err);
      toast.error('Upload failed. Please try again.');
    }
  };

  const handleSaveResume = async () => {
    try {
      const res = await axios.post(
        'http://localhost:3000/saveresume',
        { extractedText },
        { withCredentials: true }
      );
      toast.success(res.data.message || 'Resume saved successfully!');
      setSaveStatus(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save resume.');
    }
  };

  return (
    <div className="upload-resume-container">
      <h4 className="mb-3">📤 Upload Your Resume</h4>

      <form onSubmit={handleUpload} className="resume-form mb-3">
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-primary w-100">🚀 Upload Resume</button>
      </form>

      {detectedSkills.length > 0 && (
        <div className="skills-section mb-4">
          <h6>🎯 Detected Skills:</h6>
          <div className="skill-tags">
            {detectedSkills.map((skill, index) => (
              <span key={index} className="badge bg-success me-2 mb-2">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {extractedText && (
        <div className="extracted-text-section">
          <h6>📄 Extracted Resume Text:</h6>
          <pre className="resume-text">{extractedText}</pre>
          <button className="btn btn-success mt-3" onClick={handleSaveResume}>
            💾 Save Resume
          </button>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default UploadResume;
