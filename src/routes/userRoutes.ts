import { Router } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../models/User";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await userRepository.find({
      select: ["id", "firstName", "lastName", "email", "createdAt"],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Create new user
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = userRepository.create({
      firstName,
      lastName,
      email,
      password, // Note: In production, password should be hashed
    });
    await userRepository.save(user);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: "Error creating user" });
  }
});

export default router;
