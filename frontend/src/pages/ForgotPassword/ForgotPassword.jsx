import React from "react";
import { Link } from "react-router-dom";
import "./ForgetPassword.css"; 

const ForgotPassword = () => {
  return (
    <div className="container">
      <div className="form-container">
        <h2>Forgot Password</h2>
        <p className="subtitle">
          Enter your email address below, and we’ll send you instructions to reset your password.
        </p>
        <input type="email" placeholder="Enter your email address" required className="input-field" />
        <button className="btn-primary">Send Reset Link</button>
        <div style={{ marginTop: "15px" }}>
          <Link to="/login" className="back-link">Back to Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
