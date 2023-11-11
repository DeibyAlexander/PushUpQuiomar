import mongoose from 'mongoose'


const connectDB = async () => {
    try {
      await mongoose.connect("mongodb+srv://deiby:12345@clusterquiromark.ffxzlpm.mongodb.net/Quiromark");
      console.log(">>>DB is connected");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw error; 
    }
};


export default connectDB