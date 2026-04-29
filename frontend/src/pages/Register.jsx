import React from "react";
import { useNavigate } from "react-router-dom";

const Register = ({ onRegister }) => {
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await onRegister({ name, email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="card auth-card">
      <div className="card-header">
        <div className="card-avatar">RG</div>
        <div>
          <h2>Register</h2>
          <p className="muted-text">Create your account and unlock full access to VillageConnect.</p>
        </div>
      </div>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" required placeholder="Your full name" />
        </div>
        <div className="form-field">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@example.com" />
        </div>
        <div className="form-field">
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Create a password" />
        </div>
        <button className="button" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
