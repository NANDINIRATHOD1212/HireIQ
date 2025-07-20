import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/CustomQuestion.css';

const SaveCustomQuestions = () => {
  const [title, setTitle] = useState('');
  const [questionsText, setQuestionsText] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/recruiter/jobs', { withCredentials: true })
      .then(res => setJobs(res.data.jobs || []))
      .catch(err => console.error('Failed to fetch jobs', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!title || !questionsText.trim() || !selectedJobId) {
      return setError('Please fill all fields and select a job');
    }

    try {
      const res = await axios.post(
        'http://localhost:3000/recruiter/questions/manual',
        {
          title,
          questions: questionsText,
          jobId: selectedJobId,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setMessage('🎉 Question set saved successfully!');
        setTitle('');
        setQuestionsText('');
        setSelectedJobId('');
      } else {
        setError('Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setError('❌ Failed to save questions');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create Custom Question Set</h2>
      {message && <div className="success-msg">{message}</div>}
      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Java Basics Test"
        />

        <label>Select Job</label>
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
        >
          <option value="">-- Select Job --</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>

        <label>Questions (use format: Question | Answer)</label>
        <textarea
          value={questionsText}
          onChange={(e) => setQuestionsText(e.target.value)}
          placeholder={`e.g.\nWhat is Java? | A programming language\nWhat is OOP? | Object-Oriented Programming`}
        ></textarea>
        <p className="hint">Each question and answer should be on a new line, separated by <code>|</code>.</p>

        <button type="submit">Save Questions</button>
      </form>
    </div>
  );
};

export default SaveCustomQuestions;
