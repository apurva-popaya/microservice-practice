import express from "express";
import { getUserById, updateUser, deleteUser, addBulkUsers, getAllUsers } from "../controllers/user.controller.js";

const router = express.Router();

// router.post("/users", addUser);
router.post("/users/bulk", addBulkUsers);
router.get("/user/:id", getUserById);
router.get("/users", getAllUsers);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

export default router;
