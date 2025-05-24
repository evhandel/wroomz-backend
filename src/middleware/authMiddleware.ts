import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";

// Расширяем интерфейс Request для добавления поля user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: "Не предоставлен токен авторизации" });
      return;
    }

    // Проверяем формат токена: "Bearer [JWT]"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      res.status(401).json({ message: "Неверный формат токена" });
      return;
    }

    const token = parts[1];

    // Верифицируем токен
    const decoded = AuthService.verifyToken(token);

    // Добавляем данные пользователя в объект запроса
    req.user = decoded;

    next();
  } catch (error: any) {
    res.status(401).json({ message: error.message || "Невалидный токен" });
    return;
  }
};
