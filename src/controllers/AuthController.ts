import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password } = req.body;

      if (!firstName || !lastName || !email || !password) {
        return res
          .status(400)
          .json({ message: "Все поля обязательны для заполнения" });
      }

      const userData = await AuthService.register({
        firstName,
        lastName,
        email,
        password,
      });

      res.status(201).json(userData);
    } catch (error: any) {
      res
        .status(400)
        .json({ message: error.message || "Ошибка при регистрации" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email и пароль обязательны" });
      }

      const userData = await AuthService.login(email, password);
      res.json(userData);
    } catch (error: any) {
      res
        .status(401)
        .json({ message: error.message || "Ошибка аутентификации" });
    }
  }
}
