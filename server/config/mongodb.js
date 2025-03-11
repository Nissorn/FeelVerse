import mongoose from "mongoose";

const connectDB = async () =>{
mongoose.connection.on('connected',() => console.log("Databases connect"));

    await mongoose.connect(`${process.env.MONGODB_URL}/feelverse`)

};

export default connectDB;