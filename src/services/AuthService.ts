import { AppDataSource } from "../config/database";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // В продакшене нужно использовать переменные окружения

export class AuthService {
  static async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    try {
      // Проверяем, существует ли пользователь с таким email
      const existingUser = await userRepository.findOne({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new Error("Пользователь с таким email уже существует");
      }

      // Хешируем пароль перед сохранением
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Создаем нового пользователя
      const user = userRepository.create({
        ...userData,
        password: hashedPassword,
      });

      const savedUser = await userRepository.save(user);

      // Генерируем JWT токен
      const token = this.generateToken(savedUser);

      return {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  static async login(email: string, password: string) {
    try {
      // Ищем пользователя по email
      const user = await userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new Error("Пользователь не найден");
      }

      // Проверяем пароль
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error("Неверный пароль");
      }

      // Генерируем JWT токен
      const token = this.generateToken(user);

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  static generateToken(user: User) {
    // Создаем JWT токен, исключая пароль из данных
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
  }

  static verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error("Недействительный токен");
    }
  }
}
