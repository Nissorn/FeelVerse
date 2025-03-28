import notepadModel from "../models/notepadModel.js";

//เพิ่มโน้ตใหม่
const insertNote = async (req, res) => {
    try {
        const { userId, note, emoji, date,mood ,score} = req.body;

        if (!userId) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const newNote = new notepadModel({ 
            userId: userId,
            note,
            emoji,
            date,
            mood,
            score
        });                                                                                                                     

        await newNote.save();
        res.status(201).json({ success: true, message: "Note added", data: newNote });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

//ดึงโน้ตทั้งหมดของผู้ใช้
const getAllNotes = async (req, res) => {
    try {
        const notes = await notepadModel.find();  // ใช้ NotepadModel แทน Note
        res.json({ success: true, data: notes });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const getNotesId = async (req, res)=>{
    const { userId } = req.body;
    console.log(userId)
    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
        const notes = await notepadModel.find({ userId });
        res.json({ success: true, data: notes });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const getNotesobjid = async (req, res)=>{
    const { userId } = req.body;
    const { idobj } = req.query;
    console.log(userId)
    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
        const notes = await notepadModel.findOne({ _id:idobj });
        if (!notes) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }else{
            res.json({ success: true, note: notes});
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const updateNotesobjid = async (req, res) => {
    console.log('Request Query:', req.query);  // Log all query parameters
    console.log('Request Body:', req.body);
    const idobj  = req.body.idobj; // Note ID from the query params
    const { userId } = req.body;  // User ID from the body
    console.log('Note ID:', idobj);
    
    try {
        const oldnote = await notepadModel.findOne({ _id:idobj });
        if (!oldnote) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }
        if (oldnote.userId.toString() !== userId._id) {
            return res.status(403).json({ success: false, message: "You do not have permission to edit this note" });
        }
        const updatedNote = await notepadModel.findByIdAndUpdate(
            idobj, 
            req.body,
            { new: true } 
        );

        if (!updatedNote) {
            return res.status(500).json({ success: false, message: "Failed to update note" });
        }

        // Return success
        return res.status(200).json({
            success: true,
            message: "Note updated successfully",
            note: updatedNote
        });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

    

const DeleteNotesobject = async (req, res)=>{
    const { userId } = req.body;
    const { idobj } = req.query;
    console.log(userId)
    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
        const notes = await notepadModel.findOneAndDelete({ _id:idobj });
        if (!notes) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }else{
            res.json({ success: true, message:"Note deleted successfully", data: notes});
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const getNotesday = async (req, res)=>{
    const { userId} = req.body;
    const { date } = req.query;
    console.log(userId)
    console.log(date)
    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }
    try {
        const currentDate = new Date();
        const notes = await notepadModel.find({
            userId,
            date: { $regex: date }
        });

        const moodCount = notes.reduce((acc, note) => {
            const mood = note.mood;
            acc[mood] = (acc[mood] || 0) + 1; 
            return acc;
        }, {});        
        let maxMood = null;
        let maxCount = 0;
        for (const mood in moodCount) {
            if (moodCount[mood] > maxCount) {
                maxCount = moodCount[mood];
                maxMood = mood;
            }

        }

    res.json({ success: true,maxMood, notes });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const summaryMoonData =  async (req,res) => {
    const { userId, } = req.body;
    const { month ,year} = req.query;

    console.log(userId)
    console.log(month)
    console.log(year)
    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
        const currentDate = new Date();
        const targetMonth = month || (currentDate.getMonth() + 1);
        const targetYear = year || currentDate.getFullYear();
        const monthYearPattern = `${String(targetMonth).padStart(2, '0')}-${targetYear}`;

        const notes = await notepadModel.find({
            userId,
            date: { $regex: `-${monthYearPattern}$` } 
        });

        const totalNotes = notes.length;
       
        const sumScore = notes.reduce((acc,note)=>{
            return acc + (note.score || 0);
        }, 0);
        
        const moodCount = notes.reduce((acc, note) => {
            const mood = note.mood;
            acc[mood] = (acc[mood] || 0) + 1; 
            return acc;
        }, {});

        let maxMood = null;
        let maxCount = 0;
        for (const mood in moodCount) {
            if (moodCount[mood] > maxCount) {
                maxCount = moodCount[mood];
                maxMood = mood;
            }

        }
        const percentmood= sumScore/totalNotes;

        res.json({
            success: true,
            maxMood,
            percentmood,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}


export { insertNote, getAllNotes ,getNotesId,summaryMoonData,getNotesday,DeleteNotesobject,getNotesobjid,updateNotesobjid};