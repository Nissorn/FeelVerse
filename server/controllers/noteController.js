import notepadModel from "../models/notepadModel.js";

//เพิ่มโน้ตใหม่
const insertNote = async (req, res) => {
    try {
        const { userId, note, emoji, date } = req.body;

        if (!userId) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const newNote = new notepadModel({ 
            userId: userId,
            note,
            emoji,
            date,
        });                                                                                                                     

        await newNote.save();
        res.status(201).json({ success: true, message: "Note added", data: newNote });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

//ดึงโน้ตทั้งหมดของผู้ใช้
const getNotes = async (req, res) => {
    try {
        const notes = await notepadModel.find({ userId: req.user._id });  // ใช้ NotepadModel แทน Note
        res.json({ success: true, data: notes });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export { insertNote, getNotes };

