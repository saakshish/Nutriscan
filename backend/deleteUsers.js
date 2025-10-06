import mongoose from "mongoose";
import User from "./models/user.js";

mongoose.connect("mongodb://127.0.0.1:27017/nutriscan")
  .then(async () => {
    console.log("Connected to MongoDB");

    // Delete all users
    await User.deleteMany({});
    console.log("All users deleted");

    mongoose.connection.close();
  })
  .catch(err => console.log(err));
