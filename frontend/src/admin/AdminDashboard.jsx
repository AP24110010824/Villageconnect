import Card from "../components/Card";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <Card title="Admin Dashboard">
      <p>Use the admin panels to manage users, jobs, and schemes.</p>
      <ul>
        <li><Link to="/admin/users">Manage Users</Link></li>
        <li><Link to="/admin/jobs">Manage Jobs</Link></li>
        <li><Link to="/admin/schemes">Manage Schemes</Link></li>
      </ul>
    </Card>
  );
};

export default AdminDashboard;
