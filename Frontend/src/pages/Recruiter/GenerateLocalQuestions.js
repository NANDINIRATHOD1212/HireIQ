import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from "../../api.js";
function GenerateLocalQuestions() {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  const handleGenerate = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/recruiter/questions/from-local`,
        { selectedSkills, title },
        { withCredentials: true }
      );
      setQuestions(res.data.questions);
      setMessage(`✅ Generated ${res.data.total} questions.`);
      setSaveStatus('');
    } catch (err) {
      console.error('Generation Error:', err);
      setMessage('❌ Error generating questions.');
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/recruiter/questions/save-preview`,
        {},
        { withCredentials: true }
      );
      setSaveStatus(`✅ ${res.data.message}`);
    } catch (err) {
      console.error('Save Error:', err);
      setSaveStatus('❌ Failed to save the question set.');
    }
  };

  const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Express'];

  return (
    <div className="container mt-4">
      <h3>📚 Generate Questions From Local</h3>

      <div className="mb-3">
        <label>Set Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter custom title"
        />
      </div>

      <div className="mb-3">
        <label>Select Skills:</label>
        <div className="form-check">
          {skills.map(skill => (
            <div key={skill}>
              <input
                type="checkbox"
                className="form-check-input"
                id={skill}
                value={skill}
                checked={selectedSkills.includes(skill)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSkills([...selectedSkills, skill]);
                  } else {
                    setSelectedSkills(selectedSkills.filter(s => s !== skill));
                  }
                }}
              />
              <label className="form-check-label" htmlFor={skill}>
                {skill}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary mb-3" onClick={handleGenerate}>
        🎯 Generate
      </button>

      {message && <p className="text-info">{message}</p>}

      {questions.length > 0 && (
        <>
          <h4>📋 Preview - {title}</h4>
          <ul className="list-group mb-3">
            {questions.map((q, index) => (
              <li className="list-group-item" key={index}>
                <strong>Q:</strong> {q.question} <br />
                <strong>A:</strong> {q.answer}
              </li>
            ))}
          </ul>

          <button className="btn btn-success" onClick={handleSave}>
            💾 Save Question Set
          </button>

          {saveStatus && <p className="mt-2">{saveStatus}</p>}
        </>
      )}
    </div>
  );
}

export default GenerateLocalQuestions;
