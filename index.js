import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 9000;

  // ===== Connect to MongoDB ===== //
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(PORT);
  console.log(`Connected to mongodb`);
} catch (error) {
  console.error(error);  
}

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.status(200);
  res.send("Hello World");
});


app.listen(PORT, () => console.log(`Server is listening on port: ${PORT} `));

