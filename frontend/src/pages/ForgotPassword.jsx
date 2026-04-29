import React from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const ForgotPassword = () => {
  const [step, setStep] = React.useState("request");
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true);
      const response = await api.post("/users/forgot-password", { email });
      setMessage(response.data.message);
      if (response.data.otp) {
        setMessage(`${response.data.message} Your OTP is ${response.data.otp}`);
      }
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/users/reset-password", { email, otp, password });
      setMessage(response.data.message);
      setStep("completed");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card auth-card">
      <div className="card-header">
        <div className="card-avatar">FP</div>
        <div>
          <h2>Forgot Password</h2>
          <p className="muted-text">Reset your password with a secure OTP sent to your email.</p>
        </div>
      </div>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert">{error}</div>}

      {step === "request" && (
        <form onSubmit={handleRequestOtp}>
          <div className="form-field">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="you@example.com"
            />
          </div>

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={handleResetPassword}>
          <div className="form-field">
            <label>Email</label>
            <input value={email} type="email" disabled />
          </div>
          <div className="form-field">
            <label>OTP</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              required
              placeholder="Enter OTP"
            />
          </div>
          <div className="form-field">
            <label>New Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="New password"
            />
          </div>
          <div className="form-field">
            <label>Confirm Password</label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              required
              placeholder="Confirm new password"
            />
          </div>

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Resetting password..." : "Reset Password"}
          </button>
        </form>
      )}

      {step === "completed" && (
        <div>
          <p className="muted-text">Your password has been reset successfully.</p>
          <Link to="/login" className="link-muted">
            Return to login
          </Link>
        </div>
      )}

      {step !== "completed" && (
        <div className="auth-footnote">
          <Link to="/login" className="link-muted">
            Back to login
          </Link>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
