import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// ===== Import Routes ===== //
import userRouter from "./routes/user.js";
import productRouter from "./routes/product.js";
import cartRouter from "./routes/cart.js";
import paymentRouter from "./routes/payment.js";

dotenv.config();

const app = express();
// ===== Middleware ===== //
app.use(cors());
app.use(express.json());

// ===== Connect to MongoDB ===== //
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Connected to mongodb`);
} catch (error) {
  console.error(error);
}

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/payment', paymentRouter);



app.get("/", (req, res) => {
  res.status(200);
  res.send("<h1>Welcome to my API</h1>");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

