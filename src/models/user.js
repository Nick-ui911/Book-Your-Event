import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      validate: (value) => {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password must be strong");
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "Other"].includes(value)) {
          throw new Error("Invalid gender");
        }
      },
    },
    mobileNo:{
      type:String,
    },
    photoUrl: {
      type: String,
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
    },
    payments: [
      {
        toUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        amount: {
          type: Number,
          required: true,
        },
        paymentMethod: {
          type: String,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Schema methods

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashedPassword = user.password;
  const isValidPassword = await bcrypt.compare(passwordInputByUser, hashedPassword);
  return isValidPassword;
};


const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
