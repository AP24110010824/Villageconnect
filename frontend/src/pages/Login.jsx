import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await onLogin({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    }
  };

  return (
    <div className="card auth-card">
      <div className="card-header">
        <div className="card-avatar">LG</div>
        <div>
          <h2>Login</h2>
          <p className="muted-text">Use your account email and password to get started.</p>
        </div>
      </div>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@example.com" />
        </div>
        <div className="form-field">
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Enter your password" />
        </div>
        <div className="auth-actions">
          <button className="button" type="submit">Login</button>
          <Link to="/forgot-password" className="link-muted">Forgot password?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
