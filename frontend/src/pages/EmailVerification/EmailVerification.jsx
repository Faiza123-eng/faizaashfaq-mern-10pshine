import React from "react";
import "./EmailVerification.css"; 

const EmailVerification = () => {
  return (
    <div className="email-verification-container">
      <div className="email-verification-card">
        <h1 className="email-verification-title">Check Your Email</h1>
        <p className="email-verification-text">
          A verification link has been sent to your email. Please verify your account to continue.
        </p>
        <button className="email-verification-button">Resend Email</button>
      </div>
    </div>
  );
};

export default EmailVerification;
