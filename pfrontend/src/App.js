import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';

import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import JobManagement from './pages/Admin/JobManagement';

import CandidateDashboard from './pages/Candidate/CandidateDashboard';
import CandidateProfile from './pages/Candidate/CandidateProfile';
import CandidateProfileEdit from './pages/Candidate/CandidateProfileEdit';
import CandidateInterviews from './pages/Candidate/CandidateInterview';
import UploadResume from './pages/Candidate/UploadResume';
import ApplyForJobs from './pages/Candidate/Applyforjobs';
import AppliedJobs from './pages/Candidate/AppliedJobs';
import AssessmentList from './pages/Candidate/AssessmentList';
import TakeAssessment from './pages/Candidate/TakeAssessment';
import SubmittedAssessments from './pages/Candidate/SubmitAssessments';
import MySubmissions from './pages/Candidate/MySubmissions';

import RecruiterDashboard from './pages/Recruiter/RecruiterDashboard';
import PostJob from './pages/Recruiter/PostJob';
import ViewPostedJobs from './pages/Recruiter/ViewPostedJobs';
import ViewCandidates from './pages/Recruiter/ViewCandidates';
import ScheduleInterview from './pages/Recruiter/ScheduleInterview';
import SaveCustomQuestions from './pages/Recruiter/SaveCustomQuestions';
import ViewSavedQuestions from './pages/Recruiter/ViewSavedQuestions';
import UploadByPDF from './pages/Recruiter/UploadByPDF';
import GenerateLocalQuestions from './pages/Recruiter/GenerateLocalQuestions';
import ViewSubmissions from './pages/Recruiter/ViewSubmissions';
import ViewScheduledInterviews from './pages/Recruiter/ViewScheduledInterviews';
import GenerateFromAI from './pages/Recruiter/GenerateFromAI';
import RecruiterProfile from './pages/Recruiter/RecruiterProfile';
import EditRecruiterProfile from './pages/Recruiter/EditRecruiterProfile';
import RecruiterLayout from './pages/Recruiter/RecruiterLayout';

import CandidateLayout from './pages/Candidate/CandidateLayout.js'; 

import ProtectedRoute from './pages/ProtectRoutes';

function App() {
  return (
    <Routes>
      {/* 🌐 Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* 🛡️ Admin Routes */}
      <Route path="/dashboard-admin" element={<AdminDashboard />} />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute role="admin">
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/jobs"
        element={
          <ProtectedRoute role="admin">
            <JobManagement />
          </ProtectedRoute>
        }
      />

      {/* 🧑‍💼 Recruiter Routes with Layout */}
      <Route
        path="/recruiter"
        element={
          <ProtectedRoute role="recruiter">
            <RecruiterLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard-recruiter" element={<RecruiterDashboard />} />
        <Route path="profile" element={<RecruiterProfile />} />
        <Route path="profile/edit" element={<EditRecruiterProfile />} />
        <Route path="post-job" element={<PostJob />} />
        <Route path="view-jobs" element={<ViewPostedJobs />} />
        <Route path="candidates" element={<ViewCandidates />} />
        <Route path="schedule/:jobId" element={<ScheduleInterview />} />
        <Route path="questions/manual" element={<SaveCustomQuestions />} />
        <Route path="questions/saved" element={<ViewSavedQuestions />} />
        <Route path="questions/upload-pdf" element={<UploadByPDF />} />
        <Route path="questions/from-local" element={<GenerateLocalQuestions />} />
        <Route path="assessment-submissions" element={<ViewSubmissions />} />
        <Route path="view-interviews" element={<ViewScheduledInterviews />} />
        <Route path="generatefromai" element={<GenerateFromAI />} />
      </Route>

      {/* 👩‍🎓 Candidate Routes with Layout */}
      <Route
        path="/candidate"
        element={
          <ProtectedRoute role="candidate">
            <CandidateLayout />
          </ProtectedRoute>
        }
      >
        <Route path='dashboard-candidate' element={<CandidateDashboard />} />
        <Route path="profile" element={<CandidateProfile />} />
        <Route path="profile/update" element={<CandidateProfileEdit />} />
        <Route path="interviews" element={<CandidateInterviews />} />
        <Route path="upload-resume" element={<UploadResume />} />
        <Route path="jobs" element={<ApplyForJobs />} />
        <Route path="applied-jobs" element={<AppliedJobs />} />
        <Route path="assessments" element={<AssessmentList />} />
        <Route path="assessment/:id" element={<TakeAssessment />} />
        <Route path="my-assessments" element={<SubmittedAssessments />} />
        <Route path="my-submissions" element={<MySubmissions />} />
      </Route>
    </Routes>
  );
}

export default App;
