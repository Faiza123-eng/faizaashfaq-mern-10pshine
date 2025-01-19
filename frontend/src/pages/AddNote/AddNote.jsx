import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddNote.css";

const AddNote = () => {
  const [note, setNote] = useState({ title: "", content: "", tags: "" });
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!note.title || !note.content) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      const response = await axios.post(
        "/api/notes/create",
        {
          title: note.title,
          content: note.content,
          tags: note.tags.split(",").map((tag) => tag.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token
          },
        }
      );

      if (response.data.error) {
        alert(response.data.message);
      } else {
        alert("Note added successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || "Server error"}`);
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
