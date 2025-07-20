import { useSelector } from "react-redux";
import NavBar from "../NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/RecruiterDashboard.css";
import BASE_URL from "../../api.js";
function RecruiterDashboard() {
  const user = useSelector((state) => state.auth.user);

  
  if (user?.name) {
    toast.success(`Welcome back, ${user.name}!`, {
      position: "top-right",
      autoClose: 3000,
    });
  }

  return (
    <div className="d-flex recruiter-dashboard">
      <div className="flex-grow-1 p-4 dashboard-content">
        <div className="dashboard-header mb-4">
          <h2>👨‍💼 Hello, <span className="highlight">{user?.name}</span> (<span className="email">{user?.email}</span>)</h2>
          <p className="text-muted">Manage jobs, candidates, interviews, and questions—all in one place.</p>
        </div>

        <div className="card welcome-card">
          <h4>🎯 Quick Actions</h4>
          <ul>
            <li>Post a Job</li>
            <li>Review Candidates</li>
            <li>Schedule Interviews</li>
            <li>Generate Questions</li>
          </ul>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}

export default RecruiterDashboard;
