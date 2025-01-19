import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams();

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setMessage("");
      return;
    }

    try {
      const response = await axios.post(`/api/auth/reset-password/${token}`, { newPassword: password });
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
      setMessage("");
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button className="btn-primary" onClick={handleResetPassword}>
        Reset Password
      </button>
    </div>
  );
};

export default ResetPassword;
