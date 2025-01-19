import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditNote.css";

const EditNote = () => {
  const [note, setNote] = useState({ title: "", content: "", tags: "" });
  const navigate = useNavigate();
  const { id } = useParams(); 

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setNote({
            title: data.note.title,
            content: data.note.content,
            tags: data.note.tags.join(", "), 
          });
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch note:", errorData.message);
          alert(errorData.message || "Failed to fetch note.");
        }
      } catch (error) {
        console.error("Error fetching note:", error);
        alert("Error fetching note. Please try again later.");
      }
    };
  
    fetchNote();
  }, [id]);
  

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      alert("Title and content cannot be empty!");
      return;
    }

    const tagsArray = note.tags.split(",").map((tag) => tag.trim());
    const updatedNote = { ...note, tags: tagsArray };

    try {
      const response = await fetch(`http://localhost:5000/api/notes/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(updatedNote),
      });

      if (response.ok) {
        alert("Note updated successfully!");
        navigate("/dashboard");
      } else {
        alert("Failed to update note.");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="edit-note-container">
      <h2 className="edit-note-title">Edit Note</h2>

      <div className="form-group">
        <label htmlFor="title" className="form-label">Title</label>
        <input
          id="title"
          type="text"
          className="form-input animated"
          placeholder="Enter the title"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="content" className="form-label">Content</label>
        <textarea
          id="content"
          className="form-textarea animated"
          placeholder="Enter the content"
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="tags" className="form-label">Tags</label>
        <input
          id="tags"
          type="text"
          className="form-input animated"
          placeholder="Tags (comma-separated)"
          value={note.tags}
          onChange={(e) => setNote({ ...note, tags: e.target.value })}
        />
      </div>

      <button className="save-btn animated" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default EditNote;
