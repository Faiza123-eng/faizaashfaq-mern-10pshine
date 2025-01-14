import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch notes from backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from local storage
        const response = await axios.get("/api/notes/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.error) {
          alert(response.data.message);
        } else {
          setNotes(response.data.notes);
        }
      } catch (error) {
        alert(`Error fetching notes: ${error.response?.data?.message || "Server error"}`);
      }
    };

    fetchNotes();
  }, []);

  // Pin or unpin a note
  const togglePinNote = async (noteId, isPinned) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/pinned/update-note-pinned/${noteId}`,
        { isPinned: !isPinned },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.error) {
        alert(response.data.message);
      } else {
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === noteId ? { ...note, isPinned: !isPinned } : note
          )
        );
      }
    } catch (error) {
      alert(`Error pinning/unpinning note: ${error.response?.data?.message || "Server error"}`);
    }
  };

  // Favorite or unfavorite a note
  const toggleFavoriteNote = async (noteId, isFavorite) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = isFavorite
        ? `/api/favorites/remove-from-favorites/${noteId}`
        : `/api/favorites/add-to-favorites/${noteId}`;
      const response = await axios.put(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.error) {
        alert(response.data.message);
      } else {
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === noteId ? { ...note, isFavorite: !isFavorite } : note
          )
        );
      }
    } catch (error) {
      alert(`Error favoriting/unfavoriting note: ${error.response?.data?.message || "Server error"}`);
    }
  };

  // Delete a note
  const deleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`/api/notes/delete/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.error) {
        alert(response.data.message);
      } else {
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
        alert("Note deleted successfully!");
      }
    } catch (error) {
      alert(`Error deleting note: ${error.response?.data?.message || "Server error"}`);
    }
  };

  // Filter notes by search query
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
                  className="btn-small"
                  onClick={() => togglePinNote(note._id, note.isPinned)}
                >
                  {note.isPinned ? "Unpin" : "Pin"}
                </button>
                <button
                  className="btn-small"
                  onClick={() => toggleFavoriteNote(note._id, note.isFavorite)}
                >
                  {note.isFavorite ? "Unfavorite" : "Favorite"}
                </button>
                <button
                  className="btn-small btn-delete"
                  onClick={() => deleteNote(note._id)}
                >
                  Delete
                </button>
                <Link to={`/edit-note/${note._id}`}>
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
