import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GenerateFromAI = () => {
  const [skill, setSkill] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobs, setJobs] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:3000/recruiter/jobs', { withCredentials: true })
      .then((res) => {
        setJobs(res.data.jobs || []);
      })
      .catch((err) => {
        console.error("Failed to fetch jobs", err);
        toast.error("Failed to load jobs.");
      });
  }, []);

  const handleGenerate = async () => {
    if (!skill || !selectedJobId) {
      toast.warning("Please enter a skill and select a job.");
      return;
    }

    setLoading(true);
    setQuestions([]);

    try {
      const response = await axios.post(
        'http://localhost:3000/recruiter/generate-ai',
        { skill, jobId: selectedJobId },
        { withCredentials: true }
      );

      if (response.data.success && Array.isArray(response.data.questions)) {
        setQuestions(response.data.questions);
        toast.success("Questions generated successfully!");
      } else {
        toast.error("Failed to generate questions.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error generating questions.");
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!selectedJobId) {
      toast.warning("Please select a job before saving.");
      return;
    }

    const isValid = questions.every(
      (q) => q.question.trim() !== '' && q.answer.trim() !== ''
    );

    if (!isValid) {
      toast.warning("Please fill out all questions and answers before saving.");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/recruiter/questions/save-preview',
        { jobId: selectedJobId },
        { withCredentials: true }
      );

      if (response.data.message) {
        toast.success("Questions saved successfully!");
        setQuestions([]);
        setSkill('');
        setSelectedJobId('');
      } else {
        toast.error("Unknown error while saving.");
      }
    } catch (err) {
      console.error(err);

      if (err.response?.status === 409) {
        toast.error("Duplicate question set! Please change the skill or edit existing.");
      } else {
        toast.error("Failed to save questions.");
      }
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="mb-4">Generate Questions with AI</h2>

      <div className="mb-3">
        <label className="form-label">Select Job</label>
        <select
          className="form-select"
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
        >
          <option value="">-- Select Job --</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Enter Skill</label>
        <input
          type="text"
          className="form-control"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="e.g. JavaScript, Python, SQL"
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={handleGenerate}
        disabled={loading || jobs.length === 0}
      >
        {loading ? 'Generating...' : 'Generate from AI'}
      </button>

      {questions.length > 0 && (
        <div className="mt-4">
          <h4>Edit Generated Questions</h4>
          <ul className="list-group mb-3">
            {questions.map((q, index) => (
              <li className="list-group-item" key={index}>
                <label><strong>Q{index + 1}:</strong></label>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                />
                <label><strong>Answer:</strong></label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={q.answer}
                  onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                />
              </li>
            ))}
          </ul>
          <button className="btn btn-success" onClick={handleSave}>
            Save Questions
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerateFromAI;
