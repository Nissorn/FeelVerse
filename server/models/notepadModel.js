import mongoose from "mongoose";

const notepadSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    date: { 
        type: String, 
        required: true,
        set: function(value) {
            const date = new Date(value);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
    },
    note: { type: String, required: true },
    emoji: { type: String, required: true },
    mood: {type: String, required: true },
    score: {type: Number, required: true }
});

const notepadModel = mongoose.models.notepad || mongoose.model('notepad', notepadSchema);
export default notepadModel;
