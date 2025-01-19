import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import "./Signup.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Sign-up successful! Please verify your email.");
        setError(false);
        navigate("/email-verification");
      } else {
        setMessage(data.message || "Something went wrong.");
        setError(true);
      }
    } catch (err) {
      setMessage("Server error. Please try again later.");
      setError(true);
    }
  };
  
  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2 className="form-title">Sign Up</h2>
        {message && <p className={error ? "error-message" : "success-message"}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="form-input"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary">Sign Up</button>
        </form>
        <div className="redirect-link">
          <Link to="/login">Already have an account? Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
