import mongoose from "mongoose";

let connection = null;

export default async () => {
  try {
    connection = await mongoose.connect(process.env.mongoURI);
    console.log("DB connection established.");
  } catch (err) {
    console.error("DB connection failed.", err);
  }
};

export {connection};
