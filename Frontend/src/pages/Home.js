import { useState } from "react";
import { Link } from "react-router-dom";

import '../css/Home.css';

const features = [
  { icon: "🧠", title: "Smart Resume Scanner", desc: "Automatically parse and score resumes." },
  { icon: "❓", title: "AI Question Generator", desc: "Generate tailored interview questions." },
  { icon: "📋", title: "Job Posting & Tracking", desc: "Manage jobs and track applications easily." },
  { icon: "📅", title: "Interview Scheduling", desc: "Schedule interviews and send reminders." },
];

const roles = [
  { role: "Candidate", link: "/login", desc: "Explore jobs & apply easily." },
  { role: "Recruiter", link: "/login", desc: "Post jobs & manage applicants." },
  
];

const jobs = [
  { id: 1, title: "Frontend Developer", company: "TechSoft", location: "Remote" },
  { id: 2, title: "Backend Engineer", company: "InnovateX", location: "Bangalore" },
  { id: 3, title: "UI/UX Designer", company: "CreativeHub", location: "Mumbai" },
];

const testimonials = [
  { name: "Riya Sharma", feedback: "HireIQ made my job search so easy and efficient!" },
  { name: "Amit Patel", feedback: "As a recruiter, this platform saved me tons of time." },
  { name: "Sonal Gupta", feedback: "Love the AI question generator feature, very helpful." },
];

const faqs = [
  { q: "How do I create an account?", a: "Click on Register and choose your role to get started." },
  { q: "Can recruiters schedule interviews?", a: "Yes, recruiters can easily schedule and manage interviews." },
  { q: "Is my data safe?", a: "Absolutely! We use industry-standard security measures." },
];

function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if(email.trim() !== ""){
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <>
     
      <section className="hero">
        <div className="container">
          <h1 className="display-4 fw-bold">
            🚀 Welcome to <span>HireIQ</span>
          </h1>
         <p className="lead mt-3 mb-4 subtitle">Your AI-powered Hiring Companion</p>

          <p className="description">
            Scan Resumes, Generate Questions, Track Candidates, and more.
          </p>
          <div className="btn-group">
            <Link to="/register" className="btn btn-primary btn-get-started">
              ✨ Get Started
            </Link>
            <Link to="/login" className="btn btn-outline btn-get-started ms-3">
              🔐 Login
            </Link>
          </div>
        </div>
      </section>

    
      <section className="features container">
        <h2>Features</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

 
      <section className="roles container">
        <h2>Get Started as</h2>
        <div className="roles-grid">
          {roles.map((r, i) => (
            <Link key={i} to={r.link} className="role-card">
              <h3>{r.role}</h3>
              <p>{r.desc}</p>
            </Link>
          ))}
        </div>
      </section>

     
      <section className="latest-jobs container">
        <h2>Latest Job Openings</h2>
        <ul>
          {jobs.map(job => (
            <li key={job.id} className="job-item">
              <strong>{job.title}</strong> at <em>{job.company}</em> - {job.location}
              <Link to="/login" className="btn btn-sm btn-primary ms-3">Apply</Link>
            </li>
          ))}
        </ul>
      </section>

      
      <section className="testimonials container">
        <h2>What Our Users Say</h2>
        <div className="testimonial-cards">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <p>"{t.feedback}"</p>
              <h4>- {t.name}</h4>
            </div>
          ))}
        </div>
      </section>

      
      <section className="stats container">
        <h2>Our Impact</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>1000+</h3>
            <p>Jobs Posted</p>
          </div>
          <div className="stat-card">
            <h3>500+</h3>
            <p>Companies Registered</p>
          </div>
          <div className="stat-card">
            <h3>2000+</h3>
            <p>Candidates Hired</p>
          </div>
        </div>
      </section>


     
      <section className="newsletter container">
        <h2>Subscribe for Job Updates</h2>
        {subscribed ? (
          <p className="success-msg">Thank you for subscribing!</p>
        ) : (
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
         
<a href="#newsletter" className="floating-btn" title="Subscribe">📩</a>

          </form>
        )}
      </section>

     
      <section className="faqs container">
        <h2>Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <details key={i} className="faq-item">
            <summary>{faq.q}</summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </section>

     
      <footer>
        <p>© 2025 HireIQ. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Home;
