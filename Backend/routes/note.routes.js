const express = require("express");
const Note = require("../models/note.model");
const { authenticateToken } = require("../utilities");
const logger = require("../utilities/logger");

const router = express.Router();

// Add a new note
router.post("/create", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    logger.warn("Attempt to create a note without title or content");
    return res.status(400).json({
      error: true,
      message: "Title and Content are required",
    });
  }

  try {
    const userId = req.user.id;

    const newNote = new Note({
      title,
      content,
      tags: tags || [],
      userId,
    });

    const savedNote = await newNote.save();
    logger.info(`Note created successfully for user ID: ${userId}, Note ID: ${savedNote._id}`);
    return res.status(201).json({
      error: false,
      message: "Note created successfully",
      note: savedNote,
    });
  } catch (error) {
    logger.error(`Error creating note: ${error.message}`);
    return res.status(500).json({
      error: true,
      message: "Server error: " + error.message,
    });
  }
});

// Edit a note by ID
router.put("/edit/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;

  if (!title && !content && !tags) {
    logger.warn(`Attempt to update note ID: ${id} without providing any fields`);
    return res.status(400).json({
      error: true,
      message: "At least one field (title, content, or tags) must be provided for update",
    });
  }

  try {
    const note = await Note.findById(id);

    if (!note) {
      logger.warn(`Note not found for ID: ${id}`);
      return res.status(404).json({
        error: true,
        message: "Note not found",
      });
    }

    // Ensure only the owner of the note can edit it
    if (note.userId.toString() !== req.user.id) {
      logger.warn(`Unauthorized edit attempt for Note ID: ${id} by User ID: ${req.user.id}`);
      return res.status(403).json({
        error: true,
        message: "Unauthorized to edit this note",
      });
    }

    // Update the note fields
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;

    const updatedNote = await note.save();
    logger.info(`Note updated successfully. Note ID: ${id}`);
    return res.json({
      error: false,
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    logger.error(`Error updating note ID: ${id}: ${error.message}`);
    return res.status(500).json({
      error: true,
      message: "Server error: " + error.message,
    });
  }
});

// Delete a note
router.delete("/delete/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);

    // Ensure the note exists and belongs to the user
    if (!note || note.userId.toString() !== req.user.id) {
      logger.warn(`Unauthorized delete attempt or note not found. Note ID: ${id}, User ID: ${req.user.id}`);
      return res.status(404).json({ error: true, message: "Note not found or unauthorized." });
    }

    await Note.deleteOne({ _id: id });
    logger.info(`Note deleted successfully. Note ID: ${id}, User ID: ${req.user.id}`);
    res.json({ error: false, message: "Note deleted successfully." });
  } catch (error) {
    logger.error(`Error deleting note ID: ${id}: ${error.message}`);
    res.status(500).json({
      error: true,
      message: `Server error: ${error.message}`,
    });
  }
});

// Get all notes for the authenticated user
router.get("/all", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const notes = await Note.find({ userId });
    logger.info(`Notes retrieved successfully for User ID: ${userId}`);
    return res.json({
      error: false,
      message: "Notes retrieved successfully",
      notes,
    });
  } catch (error) {
    logger.error(`Error retrieving notes for User ID: ${req.user.id}: ${error.message}`);
    return res.status(500).json({
      error: true,
      message: "Server error: " + error.message,
    });
  }
});

// Test route
logger.info("Note routes loaded");
router.get("/test", (req, res) => {
  logger.info("Test endpoint for note routes hit");
  res.send("Note routes working");
});


module.exports = router;
