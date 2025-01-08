import React from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

const SignUp = () => {
  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2 className="form-title">Sign Up</h2>
        <input
          type="text"
          placeholder="Full Name"
          className="form-input"
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="form-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="form-input"
          required
        />
        <button className="btn-primary">Sign Up</button>
        <div className="redirect-link">
          <Link to="/login">Already have an account? Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
