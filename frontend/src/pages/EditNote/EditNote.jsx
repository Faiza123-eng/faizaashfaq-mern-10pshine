import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./EditNote.css";

const EditNote = () => {
  const [note, setNote] = useState({ title: "", content: "", tags: "" });
  const navigate = useNavigate();
  const { id } = useParams(); // Note ID from the route

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from local storage
        const response = await axios.get(`/api/notes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.error) {
          alert(response.data.message);
        } else {
          const { title, content, tags } = response.data.note;
          setNote({ title, content, tags: tags.join(", ") });
        }
      } catch (error) {
        alert(`Error fetching note: ${error.response?.data?.message || "Server error"}`);
        navigate("/dashboard");
      }
    };

    fetchNote();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      alert("Title and content cannot be empty!");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      const response = await axios.put(
        `/api/notes/edit/${id}`,
        {
          title: note.title,
          content: note.content,
          tags: note.tags.split(",").map((tag) => tag.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.error) {
        alert(response.data.message);
      } else {
        alert("Note updated successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || "Server error"}`);
    }
  };

  return (
    <div className="edit-note-container">
      <h2 className="edit-note-title">Edit Note</h2>
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          id="title"
          type="text"
          className="form-input"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="content" className="form-label">
          Content
        </label>
        <textarea
          id="content"
          className="form-textarea"
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="tags" className="form-label">
          Tags
        </label>
        <input
          id="tags"
          type="text"
          className="form-input"
          value={note.tags}
          onChange={(e) => setNote({ ...note, tags: e.target.value })}
        />
      </div>
      <button className="save-btn" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default EditNote;
