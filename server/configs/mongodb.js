import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "CollegeAid",   
    });

    console.log("Database Connected to CollegeAid");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

export default connectDB;
