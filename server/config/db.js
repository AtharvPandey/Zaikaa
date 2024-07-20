import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://ZaikaaFood:Zaikaa123@cluster0.wfprzey.mongodb.net/zaikaa-food"
    )
    .then(() => console.log("Database is Conntected"));
};
