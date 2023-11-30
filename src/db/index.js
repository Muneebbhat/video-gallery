import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const databaseConnection = async () => {
  try {
    const datbaseResponse = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`mongodb connected host ${datbaseResponse.connection.host}`);
  } catch (error) {
    console.log(`MONGODB CONNECTION ERROR`, error.message);
  }
};

export default databaseConnection;
