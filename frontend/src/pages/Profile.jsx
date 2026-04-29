import { Link } from "react-router-dom";
import Card from "../components/Card";

const Profile = ({ user }) => {
  return (
    <div className="profile-grid">
      <Card title="Account details">
        {user ? (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p className="muted-text">Your data is secured and your password is stored using modern encryption.</p>
          </>
        ) : (
          <p>Please log in to view your profile.</p>
        )}
      </Card>

      <Card title="Quick actions">
        <div className="action-grid">
          <Link to="/forgot-password" className="button secondary">Update password</Link>
          <Link to="/jobs" className="button secondary">View jobs</Link>
          <Link to="/schemes" className="button secondary">Browse schemes</Link>
          <Link to="/complaints" className="button secondary">Submit complaint</Link>
        </div>
        <p className="muted-text">Use these shortcuts to manage your account and navigate to the most important parts of VillageConnect.</p>
      </Card>
    </div>
  );
};

export default Profile;
