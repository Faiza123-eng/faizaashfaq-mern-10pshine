import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddNote.css";

const AddNote = () => {
  const [note, setNote] = useState({ title: "", content: "", tags: "" });
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!note.title || !note.content) {
      alert("Please fill all required fields.");
      return;
    }

    const tagsArray = note.tags.split(",").map((tag) => tag.trim());
    const newNote = { ...note, tags: tagsArray };

    try {
      const response = await fetch("http://localhost:5000/api/notes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(newNote),
      });

      if (response.ok) {
        alert("Note added successfully!");
        navigate("/dashboard");
      } else {
        alert("Failed to add note.");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      alert("Server error. Please try again later.");
    }
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
