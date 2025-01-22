import mongoose from 'mongoose'; // Using import instead of require

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the User model
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false, // Notes are not favorites by default
  },
  isPinned: {
    type: Boolean,
    default: false, // Notes are not pinned by default
  },
});

export default mongoose.model('Note', NoteSchema); // Export the model as default
