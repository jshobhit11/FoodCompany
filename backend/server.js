// const express = require("express");
// const app = express();
// const dotenv = require("dotenv");
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

dotenv.config();

const app = express();

//middleware
app.use(cors()); //access backend from frontend
app.use(express.json()); //request from frontend to backend

const PORT = process.env.PORT || 4000;
const URL = process.env.MONGO_DB_URL;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

// Connect to MongoDB
connectToDatabase();

//defining routes
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads")); // mount this folder at this end point
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
