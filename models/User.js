import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],

  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,

  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password must be at least 8 characters long"],
    maxLength: [20, "Password must not be more than 20 characters"],
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

  orders: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
}, {
    timestamps: true
});

// Hash the password before saving to the database.
userSchema.pre("save", async function (next) {
    try {
      if (this.isModified("password")) {
        const hashedPassword = await bcrypt.hash(this.password, 6);
        this.password = hashedPassword;
      }
      next();
    } catch (error) {
      next(error); 
    }
  });
  
  // Compare the password with the hashed password.
  userSchema.methods.comparePassword = async function (password) {
    try {
      const isMatch = await bcrypt.compare(password, this.password);
      return isMatch;
    } catch (error) {
      throw error;
    }
  };
  
const User = mongoose.model("User", userSchema);
export default User;

