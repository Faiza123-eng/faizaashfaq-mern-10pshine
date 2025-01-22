import express from 'express'; // Replace require with import
import Note from '../models/note.model.js'; // Ensure you use .js extension
import { authenticateToken } from '../utilities.js'; // Ensure you use .js extension
import logger from '../utilities/logger.js'; // Ensure you use .js extension

const router = express.Router();

// Pin/Unpin Note
router.put("/update-note-pinned/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { isPinned } = req.body;
  const { id: userId } = req.user;

  try {
    const note = await Note.findOne({ _id: id, userId });

    if (!note) {
      logger.warn(`Note not found. Note ID: ${id}, User ID: ${userId}`);
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    note.isPinned = isPinned;
    await note.save();
    logger.info(`Note pinned/unpinned successfully. Note ID: ${id}, User ID: ${userId}, isPinned: ${isPinned}`);

    return res.json({
      error: false,
      note,
      message: "Note pinned/unpinned successfully",
    });
  } catch (error) {
    logger.error(`Error pinning/unpinning note. Note ID: ${id}, User ID: ${userId}, Error: ${error.message}`);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

logger.info("Pinned routes loaded");
router.get("/test", (req, res) => {
  logger.info("Test endpoint for pinned routes hit");
  res.send("Pinned routes working");
});

export default router;
