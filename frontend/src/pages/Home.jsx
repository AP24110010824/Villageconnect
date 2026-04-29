import { Link } from "react-router-dom";
import Card from "../components/Card";

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">VillageConnect</p>
          <h1 className="hero-title">Your local services, jobs, and schemes — all in one powerful dashboard.</h1>
          <p className="hero-description">
            Discover curated opportunities, government support, agriculture resources, and complaint assistance with clear navigation and smart filters.
          </p>
          <div className="hero-actions">
            <Link to="/jobs" className="button hero-button">
              Browse Jobs
            </Link>
            <Link to="/schemes" className="button secondary hero-button">
              Explore Schemes
            </Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-title">Jobs</span>
            <strong>Browse verified opportunities</strong>
          </div>
          <div className="stat-card">
            <span className="stat-title">Schemes</span>
            <strong>Access agriculture & welfare programs</strong>
          </div>
          <div className="stat-card">
            <span className="stat-title">Complaints</span>
            <strong>Track support requests instantly</strong>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <Card title="Smart job discovery">
          <p>Filter opportunities by location, category, and salary to find the right match faster.</p>
        </Card>
        <Card title="Government support">
          <p>Access schemes that help farmers, small businesses, and community members navigate benefits with confidence.</p>
        </Card>
        <Card title="Agriculture insights">
          <p>Discover relevant resources and local agriculture programs designed for productivity and growth.</p>
        </Card>
        <Card title="Secure profile tools">
          <p>Manage your account, reset passwords via OTP, and keep your community interaction safe.</p>
        </Card>
      </section>
    </div>
  );
};

export default Home;
