import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import Sidebar from "./Sidebar"; 
import "./Dashboard.css";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [filter, setFilter] = useState("all"); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/notes/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, 
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNotes(data.notes);
        } else {
          console.error("Failed to fetch notes");
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  const filteredNotes = notes.filter((note) => {
    if (filter === "favorites") {
      return note.isFavorite;
    } else if (filter === "pinned") {
      return note.isPinned;
    }
    return (
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  const handleAddNote = () => navigate("/add-note");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); 
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); 
    navigate("/login"); 
  };

  const toggleFavorite = async (noteId, isFavorite) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/favorites/${
          isFavorite ? "remove-from-favorites" : "add-to-favorites"
        }/${noteId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.ok) {
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === noteId ? { ...note, isFavorite: !isFavorite } : note
          )
        );
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const togglePin = async (noteId, isPinned) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/pinned/update-note-pinned/${noteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ isPinned: !isPinned }),
        }
      );
      if (response.ok) {
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === noteId ? { ...note, isPinned: !isPinned } : note
          )
        );
      }
    } catch (error) {
      console.error("Error updating pinned status:", error);
    }
  };

  const downloadNoteAsPDF = (note) => {
    const doc = new jsPDF();

    
    doc.setFontSize(16);
    doc.text(note.title, 10, 10); 
    doc.setFontSize(12);
    doc.text(note.content, 10, 30); 


    if (note.tags.length > 0) {
      doc.text("Tags:", 10, 60);
      doc.text(note.tags.join(", "), 10, 70); 
    }

    
    doc.save(`${note.title}.pdf`);
  };

  return (
    <div className="dashboard-container">
      <button className="hamburger-menu" onClick={toggleSidebar}>
        &#9776; 
      </button>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        setFilter={setFilter}
        handleLogout={handleLogout}
      />

      <h1 className="main-heading">My Notes</h1>

      
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search notes by title or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>

     
      <div className="notes-list">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              className={`note-card ${note.isPinned ? "pinned" : ""}`}
              key={note._id}
            >
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <div className="note-tags">
                {note.tags.map((tag, index) => (
                  <span key={`${note._id}-${index}`} className="note-tag">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="note-actions">
                <button
                  className={`btn-small ${
                    note.isFavorite ? "favorite" : ""
                  }`}
                  style={{
                    background: "#007bff",
                    color: "white",
                    border: "2px solid #007bff",
                  }}
                  onClick={() => toggleFavorite(note._id, note.isFavorite)}
                >
                  {note.isFavorite ? "Unfavorite" : "Favorite"}
                </button>
                <button
                  className={`btn-small ${note.isPinned ? "pinned" : ""}`}
                  style={{
                    background: "#007bff",
                    color: "white",
                    border: "2px solid #007bff",
                  }}
                
                  onClick={() => togglePin(note._id, note.isPinned)}
                >
                  {note.isPinned ? "Unpin" : "Pin"}
                </button>
                <Link to={`/edit-note/${note._id}`}>
                  <button className="btn-small"
                  style={{
                    background: "#007bff",
                    color: "white",
                    height: "40px", // Set the same height
                    width: "120px", // Set the same width
                    border: "2px solid #007bff",
                  }}
                  >Edit Note</button>
                </Link>
                <button
                  className="btn-small btn-delete"
                  style={{
                    background: "#007bff",
                    color: "white",
                    height: "40px", // Set the same height
                    width: "120px", // Set the same width
                    border: "2px solid #007bff",
                  }}
                  onClick={async () => {
                    const response = await fetch(
                      `http://localhost:5000/api/notes/delete/${note._id}`,
                      {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "accessToken"
                          )}`,
                        },
                      }
                    );
                    if (response.ok) {
                      setNotes((prevNotes) =>
                        prevNotes.filter((n) => n._id !== note._id)
                      );
                    }
                  }}
                >
                  Delete
                </button>
                <button
                  className="btn-small btn-download"
                  style={{
                    background: "#4caf50",
                    color: "white",
                    border: "2px solid #4caf50",
                    boxShadow: "0 0 5px #4caf50, 0 0 10px rgba(76, 175, 80, 0.7)",
                  }}
                  onClick={() => downloadNoteAsPDF(note)}
                >
                  Download as PDF
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No notes found.</p>
        )}
      </div>


      <div className="add-note-container">
        <button className="btn-primary" onClick={handleAddNote}>
          + Add Note
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
