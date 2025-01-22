import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    createdOn: { type: Date, default: new Date().getTime() },
    isVerified: {type: Boolean, default: false},   
});

export default mongoose.model("User", userSchema);

module.exports = mongoose.model("User", userSchema);
