import express from 'express';
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js';
import noteRoutes from './routes/noteRoutes.js';

const app = express();
const port = process.env.PORT || 4000
connectDB();

const allowedOrigins = ['http://localhost:5173', 'https://feelverse.vercel.app', 'https://feelverse-server.vercel.app']

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}))

//API Endpoints
app.get('/',(req,res) => res.send("API SUSU"));
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/note', noteRoutes)

app.listen(port, () => console.log(`Server is Running on port ${port}`));
