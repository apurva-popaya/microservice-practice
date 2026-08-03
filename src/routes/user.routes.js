import express from "express";
import { addUser, getUserByContact, updateUser, deleteUser, addBulkUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/users", addUser);
router.get("/user/:contact", getUserByContact);
router.put("/user/:contact", updateUser);
router.delete("/user/:contact", deleteUser);
router.post("/users/bulk", addBulkUsers);

export default router;
