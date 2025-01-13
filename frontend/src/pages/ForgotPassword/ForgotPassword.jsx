import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post("/api/auth/forget-password", { email });
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link.");
      setMessage("");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Forgot Password</h2>
        <p className="subtitle">
          Enter your email address below, and we’ll send you instructions to reset your password.
        </p>
        <input
          type="email"
          placeholder="Enter your email address"
          required
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn-primary" onClick={handleForgotPassword}>
          Send Reset Link
        </button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <div style={{ marginTop: "15px" }}>
          <Link to="/login" className="back-link">Back to Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
