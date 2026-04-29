import { Link } from "react-router-dom";
import Card from "../components/Card";

const Dashboard = ({ user }) => {
  return (
    <div className="dashboard-grid">
      <Card title="Dashboard Overview">
        {user ? (
          <>
            <p className="hero-description">Welcome back, {user.name}. Your VillageConnect dashboard helps you stay connected to jobs, schemes, and local support.</p>
            <div className="dashboard-badges">
              <span className="detail-pill keyword-pill">Role: {user.role}</span>
              <span className="detail-pill salary-pill">Secure access</span>
              <span className="detail-pill keyword-pill">OTP-enabled reset</span>
            </div>
          </>
        ) : (
          <p>Please log in to view your dashboard.</p>
        )}
      </Card>

      <Card title="Your activity">
        <div className="stat-grid">
          <div className="stat-box">
            <span className="stat-value">3</span>
            <span className="stat-label">Recent jobs viewed</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">2</span>
            <span className="stat-label">Saved schemes</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">0</span>
            <span className="stat-label">Open complaints</span>
          </div>
        </div>
        <p className="muted-text">Track your most important actions at a glance and use quick links to move faster.</p>
      </Card>

      <Card title="Quick start">
        <div className="action-grid">
          <Link to="/jobs" className="button">Browse jobs</Link>
          <Link to="/schemes" className="button">Explore schemes</Link>
          <Link to="/agriculture" className="button">View agriculture</Link>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
