import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewSavedQuestions = () => {
  const [questionSets, setQuestionSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedQuestionsText, setEditedQuestionsText] = useState(''); // multiline string Q|A

  // Fetch saved question sets
  const fetchQuestionSets = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/recruiter/questions/saved', {
        withCredentials: true
      });

      const processedSets = res.data.map(set => ({
        ...set,
        questions: JSON.parse(set.questions),
      }));

      setQuestionSets(processedSets);
      setError(null);
    } catch (err) {
      setError('Error fetching question sets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionSets();
  }, []);

  // Start editing a question set: convert questions array back to multiline string Q|A
  const startEditing = (set) => {
    setEditingId(set.id);
    setEditedTitle(set.title);
    const qString = set.questions.map(q => `${q.question} | ${q.answer || ''}`).join('\n');
    setEditedQuestionsText(qString);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditedTitle('');
    setEditedQuestionsText('');
  };

  // Save edits (calls backend)
  const saveEdits = async () => {
    if (!editedTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/recruiter/question-set/edit/${editingId}`,
        {
          title: editedTitle,
          questions: editedQuestionsText,
        },
        { withCredentials: true }
      );

      setEditingId(null);
      setEditedTitle('');
      setEditedQuestionsText('');
      fetchQuestionSets();
    } catch (err) {
      alert("Failed to update question set");
      console.error(err);
    }
  };

  // Delete question set
  const deleteSet = async (id) => {
    if (window.confirm("Are you sure you want to delete this question set?")) {
      try {
        await axios.post(
          `http://localhost:3000/recruiter/question-set/delete/${id}`,
          {},
          { withCredentials: true }
        );
        fetchQuestionSets();
      } catch (err) {
        alert("Failed to delete question set");
        console.error(err);
      }
    }
  };

  if (loading) return <p>Loading question sets...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h3>📋 Saved Question Sets</h3>
      {questionSets.length === 0 && <p>No question sets saved yet.</p>}

      {questionSets.map(set => (
        <div key={set.id} className="card mb-3">
          <div className="card-header d-flex justify-content-between align-items-center">
            {editingId === set.id ? (
              <input
                type="text"
                className="form-control me-3"
                style={{ maxWidth: '300px' }}
                value={editedTitle}
                onChange={e => setEditedTitle(e.target.value)}
              />
            ) : (
              <>
                <strong>{set.title}</strong>
                <small className="text-muted ms-3">
                  Created on {new Date(set.createdAt).toLocaleDateString()}
                </small>
              </>
            )}

            <div>
              {editingId === set.id ? (
                <>
                  <button className="btn btn-success btn-sm me-2" onClick={saveEdits}>
                    Save
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={cancelEditing}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => startEditing(set)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteSet(set.id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          <ul className="list-group list-group-flush">
            {editingId === set.id ? (
              <li className="list-group-item">
                <textarea
                  rows={Math.max(5, set.questions.length + 2)}
                  className="form-control"
                  value={editedQuestionsText}
                  onChange={e => setEditedQuestionsText(e.target.value)}
                  placeholder="Edit questions and answers here, format: Question | Answer, one per line"
                />
              </li>
            ) : (
              set.questions.map((q, i) => (
                <li key={i} className="list-group-item">
                  <strong>Q: </strong>{q.question}<br />
                  <strong>A: </strong>{q.answer || 'N/A'}
                </li>
              ))
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ViewSavedQuestions;
