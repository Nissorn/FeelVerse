import mongoose from "mongoose";

const notepadSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    date: { type: String, required: true },
    note: { type: String, required: true },
    emoji: { type: String, required: true },
});

const notepadModel = mongoose.models.notepad || mongoose.model('notepad', notepadSchema);
export default notepadModel;
