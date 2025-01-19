import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="content">
        <img src="/Noteapp.png" alt="App Logo" className="logo" />
        <h1 className="title">Welcome to NotesApp</h1>
        <p className="subtitle">Capture your thoughts, one note at a time.</p>
        <div className="button-group">
          <Link to="/signup">
            <button className="btn btn-primary">Get Started</button>
          </Link>
          <Link to="/login">
            <button className="btn btn-secondary">Log In</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
