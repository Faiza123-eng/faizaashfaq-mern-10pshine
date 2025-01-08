import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "First Note",
      content: "This is the content of the first note.",
      isPinned: false,
      isFavorite: false,
      tags: ["work"],
    },
    {
      id: 2,
      title: "Second Note",
      content: "This is the content of the second note.",
      isPinned: true,
      isFavorite: false,
      tags: ["personal"],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Logic to fetch updated notes from backend 
  }, []);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleAddNote = () => navigate("/add-note");

  return (
    <div className="dashboard-container">
      <h1 className="main-heading">My Notes</h1>

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search notes by title or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>

      {/* Notes List */}
      <div className="notes-list">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              className={`note-card ${note.isPinned ? "pinned" : ""}`}
              key={note.id}
            >
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <div className="note-tags">
                {note.tags.map((tag, index) => (
                  <span key={`${note.id}-${index}`} className="note-tag">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="note-actions">
                <button
                  className="btn-small"
                  onClick={() =>
                    setNotes((prevNotes) =>
                      prevNotes.map((n) =>
                        n.id === note.id ? { ...n, isPinned: !n.isPinned } : n
                      )
                    )
                  }
                >
                  {note.isPinned ? "Unpin" : "Pin"}
                </button>
                <button
                  className="btn-small"
                  onClick={() =>
                    setNotes((prevNotes) =>
                      prevNotes.map((n) =>
                        n.id === note.id
                          ? { ...n, isFavorite: !n.isFavorite }
                          : n
                      )
                    )
                  }
                >
                  {note.isFavorite ? "Unfavorite" : "Favorite"}
                </button>
                <button
                  className="btn-small btn-delete"
                  onClick={() =>
                    setNotes((prevNotes) =>
                      prevNotes.filter((n) => n.id !== note.id)
                    )
                  }
                >
                  Delete
                </button>
                <Link to={`/edit-note/${note.id}`}>
                  <button className="btn-small">Edit</button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No notes found.</p>
        )}
      </div>

      {/* Add Note Button */}
      <div className="add-note-container">
        <button className="btn-primary" onClick={handleAddNote}>
          + Add Note
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
