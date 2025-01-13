import React, { useState } from "react";
import axios from "axios";
import "./EmailVerification.css";

const EmailVerification = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResendEmail = async () => {
    try {
      const response = await axios.post("/api/auth/resend-verification-email");
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend email.");
      setMessage("");
    }
  };

  return (
    <div className="email-verification-container">
      <div className="email-verification-card">
        <h1 className="email-verification-title">Check Your Email</h1>
        <p className="email-verification-text">
          A verification link has been sent to your email. Please verify your account to continue.
        </p>
        <button className="email-verification-button" onClick={handleResendEmail}>
          Resend Email
        </button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default EmailVerification;
