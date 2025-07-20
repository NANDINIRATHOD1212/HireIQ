import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/AssessmentList.css';
import BASE_URL from "../../api.js";
const AssessmentList = () => {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/candidate/assessments`, { withCredentials: true })
      .then((res) => {
        setAssessments(res.data.assessments || []);
        if ((res.data.assessments || []).length === 0) {
          toast.info("No assessments available.");
        }
      })
      .catch((err) => {
        console.error('Failed to fetch assessments', err);
        toast.error("Failed to load assessments.");
      });
  }, []);

  return (
    <div className="assessment-container container mt-4">
      <h3 className="mb-4 text-center">📝 Available Assessments</h3>

      {assessments.length === 0 ? (
        <p className="text-center text-muted">No assessments found.</p>
      ) : (
        <div className="row">
          {assessments.map((assess) => (
            <div className="col-md-6 mb-4" key={assess.id}>
              <div className="card assessment-card p-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0">{assess.title}</h5>
                  <Link to={`/candidate/assessment/${assess.id}`} className="btn btn-outline-primary">
                    Take
                  </Link>
                </div>

                {/* ✅ Recruiter Info */}
                {assess.User && (
                  <>
                    <p className="mb-1"><strong>Recruiter:</strong> {assess.User.name || 'N/A'}</p>
                    <p className="mb-1"><strong>Email:</strong> {assess.User.email || 'N/A'}</p>
                    <p className="mb-1"><strong>Company:</strong> {assess.User.company || 'Not Provided'}</p>
                  </>
                )}

                {/* ✅ Job Info (if exists) */}
                {assess.Job && (
                  <>
                  
                    <p className="mb-1"><strong>Job Title:</strong> {assess.Job.title}</p>
                    <p className="mb-1"><strong>Location:</strong> {assess.Job.location}</p>
                    <p className="mb-1"><strong>Type:</strong> {assess.Job.type}</p>
                    <p className="mb-1"><strong>Salary:</strong> {assess.Job.salary}</p>
                    <p className="mb-1"><strong>Skills:</strong> {assess.Job.skillsRequired}</p>
                    <p className="mb-1"><strong>Description:</strong> {assess.Job.description}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AssessmentList;
