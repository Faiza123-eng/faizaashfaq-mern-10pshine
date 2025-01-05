const express = require("express");
const Note = require("../models/note.model");
const { authenticateToken } = require("../utilities");
const logger = require("../utilities/logger");
const router = express.Router();

// Add to Favorites
router.put("/add-to-favorites/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  try {
    const note = await Note.findOne({ _id: id, userId });

    if (!note) {
      logger.warn(`Note not found. Note ID: ${id}, User ID: ${userId}`);
      return res.status(404).json({
        error: true,
        message: "Note not found",
      });
    }

    if (note.isFavorite) {
      logger.info(`Note already in favorites. Note ID: ${id}, User ID: ${userId}`);
      return res.json({
        error: true,
        message: "Note is already in favorites",
      });
    }

    note.isFavorite = true;
    await note.save();
    logger.info(`Note added to favorites. Note ID: ${id}, User ID: ${userId}`);

    return res.json({
      error: false,
      note,
      message: "Note added to favorites successfully",
    });
  } catch (error) {
    logger.error(`Error adding note to favorites. Note ID: ${id}, User ID: ${userId}, Error: ${error.message}`);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Remove from Favorites
router.put("/remove-from-favorites/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  try {
    const note = await Note.findOne({ _id: id, userId });

    if (!note) {
      logger.warn(`Note not found. Note ID: ${id}, User ID: ${userId}`);
      return res.status(404).json({
        error: true,
        message: "Note not found",
      });
    }

    if (!note.isFavorite) {
      logger.info(`Note is not in favorites. Note ID: ${id}, User ID: ${userId}`);
      return res.json({
        error: true,
        message: "Note is not in favorites",
      });
    }

    note.isFavorite = false;
    await note.save();
    logger.info(`Note removed from favorites. Note ID: ${id}, User ID: ${userId}`);

    return res.json({
      error: false,
      note,
      message: "Note removed from favorites successfully",
    });
  } catch (error) {
    logger.error(`Error removing note from favorites. Note ID: ${id}, User ID: ${userId}, Error: ${error.message}`);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Get Favorite Notes
router.get("/all-favorites", authenticateToken, async (req, res) => {
  const { id: userId } = req.user;

  try {
    const favoriteNotes = await Note.find({ userId, isFavorite: true });
    logger.info(`Favorite notes retrieved for User ID: ${userId}`);

    return res.json({
      error: false,
      notes: favoriteNotes,
      message: "Favorite notes retrieved successfully",
    });
  } catch (error) {
    logger.error(`Error fetching favorite notes for User ID: ${userId}, Error: ${error.message}`);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

logger.info("Favorite routes loaded");
router.get("/test", (req, res) => {
  logger.info("Test endpoint for favorite routes hit");
  res.send("Favorite routes working");
});

module.exports = router;
