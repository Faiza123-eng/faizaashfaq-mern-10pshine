import React from "react";
import { Link } from "react-router-dom";


const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>NoteKeeper</h1>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/add-note">Add Note</Link>
        <Link to="/reset-password">Reset Password</Link>
      </div>
    </nav>
  );
};

export default Navbar;
