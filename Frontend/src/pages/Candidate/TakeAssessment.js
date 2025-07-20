import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/TakeAssessment.css';
import BASE_URL from "../../api.js";
const TakeAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState('');
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`${BASE_URL}/candidate/assessment/${id}`, { withCredentials: true })
      .then((res) => {
        if (res.data.alreadyTaken) {
          toast.info('You have already taken this assessment.');
          navigate('/candidate/my-assessments');
        } else {
          setQuestions(res.data.questions || []);
          setTitle(res.data.title || 'Assessment');
          setAnswers(new Array(res.data.questions.length).fill(''));
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || 'Unable to load assessment.');
        toast.error('Failed to load assessment.');
      });
  }, [id, navigate]);

  const handleChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/candidate/assessment/${id}`,
        { answers },
        { withCredentials: true }
      );
      toast.success(`Submitted successfully! You scored ${res.data.score}/${res.data.total}`);
      setTimeout(() => navigate('/candidate/my-assessments'), 2500);
    } catch (err) {
      console.error('Submit error:', err);
      toast.error(err.response?.data?.message || 'Submission failed.');
    }
  };

  return (
    <div className="container mt-5 take-assessment">
      <ToastContainer />
      {error ? (
        <p className="text-danger text-center">{error}</p>
      ) : (
        <>
          <h3 className="mb-4 text-center">📝 {title}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {questions.map((q, index) => (
              <div key={index} className="mb-4">
                <label className="form-label">
                  <strong>Q{index + 1}:</strong> {q.question}
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={answers[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  required
                />
              </div>
            ))}
            <button type="submit" className="btn btn-success w-100 mt-3">
              ✅ Submit Assessment
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default TakeAssessment;
