import mongoose from "mongoose";

// Connecting to MongoDB Database
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/ed`);
        console.log(`MongoDB Connected!! ${connection.connection.host}`);
    } 
    catch(error) {
        console.log(`Error in connnecting to MongoDB, ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
