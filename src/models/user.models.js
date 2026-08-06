import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["owner", "contact-person", "tenant"],
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    country_code:{
      type: String,
      required: true,
      trim: true,
    },

    contact: {
      type: String,
      required: true,
      trim: true,
    },

    contact_hash:{
      type: String,
      required: true,
      unique: true,
      index:true,
    },

    org_name: {
      type: String,
      // required: true,
    },

    org_location: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
