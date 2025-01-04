import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddNote.css";


const AddNote = () => {
  const [note, setNote] = useState({ title: "", content: "", tags: "" });
  const navigate = useNavigate();

  const handleSave = () => {
    if (!note.title || !note.content) {
      alert("Please fill all required fields.");
      return;
    }
    alert("Note added successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="note-container">
      <h2>Add New Note</h2>
      <input
        type="text"
        placeholder="Title"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
      />
      <textarea
        placeholder="Content"
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
      ></textarea>
      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={note.tags}
        onChange={(e) => setNote({ ...note, tags: e.target.value })}
      />
      <button className="btn-primary" onClick={handleSave}>
        Save Note
      </button>
    </div>
  );
};

export default AddNote;
