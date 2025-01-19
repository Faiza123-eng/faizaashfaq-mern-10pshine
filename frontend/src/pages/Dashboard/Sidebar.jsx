
import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; 

const Sidebar = ({ isOpen, toggleSidebar, setFilter, handleLogout }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={toggleSidebar}>
        &times;
      </button>
      <ul className="sidebar-options">
        <li onClick={() => { setFilter("all"); toggleSidebar(); }}>All Notes</li>
        <li onClick={() => { setFilter("favorites"); toggleSidebar(); }}>Favorites</li>
        <li onClick={() => { setFilter("pinned"); toggleSidebar(); }}>Pinned</li>
        <li onClick={() => { handleLogout(); toggleSidebar(); }}>Logout</li>
      </ul>
    </div>
  );
};

export default Sidebar;