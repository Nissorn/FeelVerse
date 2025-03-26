import express from "express";
import { insertNote, getAllNotes,getNotesId,summaryMoonData,getNotesday,DeleteNotesobject,getNotesobjid,updateNotesobjid } from "../controllers/noteController.js"; 
import userAuth from '../middleware/userAuth.js';

const noterouter = express.Router();

noterouter.post("/insertnote", userAuth,insertNote);
noterouter.get("/Allnotes",  getAllNotes);
noterouter.get("/notesid",userAuth,getNotesId );
noterouter.get("/summary", userAuth,summaryMoonData);
noterouter.get("/noteday",userAuth,getNotesday)
noterouter.delete("/notedelete",userAuth,DeleteNotesobject)
noterouter.get("/notedobjid",userAuth,getNotesobjid)
noterouter.put("/updatenodeobj",userAuth,updateNotesobjid)
export default noterouter; 
