import mongoose from "mongoose";
import { encryptContact, decryptContact } from "../utils/encryption.js";

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

    contact: {
      type: String,
      required: true,
      trim: true,
      set(value) {
        return encryptContact(value);
      },

      get(value) {
        const decrypted = decryptContact(value);
        return decrypted;
      },
    },

    contact_hash: {
      type: String,
      required: true,
    },

    org_name: {
      type: String,
      required: true,
    },

    org_location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
    toObject: {
      getters: true,
    },
  },
);

userSchema.index(
    {
        type: 1,
        contact_hash: 1,
    },
    {
        unique: true,
    }
);


export default mongoose.model("User", userSchema);
