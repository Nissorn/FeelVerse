import express from "express";
import { insertNote, getNotes } from "../controllers/noteController.js"; 
import userAuth from '../middleware/userAuth.js';

const noterouter = express.Router();


noterouter.post("/insertnote", userAuth,insertNote);
noterouter.get("/notes", userAuth, getNotes);


export default noterouter; 
