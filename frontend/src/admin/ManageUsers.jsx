import React from "react";
import api from "../services/api";
import Card from "../components/Card";

const ManageUsers = () => {
  const [users, setUsers] = React.useState([]);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (err) {
        setError("Unable to load users. Make sure you are logged in as an admin.");
      }
    };

    loadUsers();
  }, []);

  return (
    <Card title="Manage Users">
      {error && <div className="alert">{error}</div>}
      {users.map((user) => (
        <div key={user._id} className="card">
          <p><strong>{user.name}</strong></p>
          <p>{user.email}</p>
          <p>{user.role}</p>
        </div>
      ))}
    </Card>
  );
};

export default ManageUsers;
