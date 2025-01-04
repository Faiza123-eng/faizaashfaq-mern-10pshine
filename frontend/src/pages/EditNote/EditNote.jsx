import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditNote.css"; 

const EditNote = () => {
  const [note, setNote] = useState({
    title: "Sample Title",
    content: "Sample Content",
    tags: "tag1, tag2",
  });
  const navigate = useNavigate();
  const handleSave = () => {
    if (!note.title.trim() || !note.content.trim()) {
      alert("Title and content cannot be empty!");
      return;
    }

    const tagsArray = note.tags.split(",").map((tag) => tag.trim());
    console.log("Updated Note:", { ...note, tags: tagsArray });

    alert("Note updated successfully!");
    navigate("/dashboard");
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
          className="form-input animated"
          placeholder="Enter the title"
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
          className="form-textarea animated"
          placeholder="Enter the content"
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
