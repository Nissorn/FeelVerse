import mongoose from "mongoose";

const NotepadSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    note: { type: String, required: true },
    emoji: { type: String, required: true },
}, { timestamps: true });

const NotepadModel = mongoose.models.Notepad || mongoose.model('Notepad', NotepadSchema);
export default NotepadModel;
