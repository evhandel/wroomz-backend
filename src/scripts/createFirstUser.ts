import "reflect-metadata";
import readline from "readline";
import bcrypt from "bcrypt";
import { AppDataSource } from "../config/database";
import { User } from "../models/User";

// Создаем интерфейс для чтения данных из консоли
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Функция для запроса данных пользователя
function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

async function createUser() {
  try {
    console.log("Инициализация подключения к базе данных...");
    await AppDataSource.initialize();
    console.log("Подключение установлено.");

    const userRepository = AppDataSource.getRepository(User);

    // Проверяем, есть ли уже пользователи в системе
    const userCount = await userRepository.count();
    if (userCount > 0) {
      console.log(
        `В системе уже есть ${userCount} пользователь(-ей). Вы уверены, что хотите создать еще одного?`
      );
      const confirmation = await question("Введите 'да' для подтверждения: ");
      if (confirmation.toLowerCase() !== "да") {
        console.log("Операция отменена.");
        rl.close();
        process.exit(0);
      }
    }

    // Запрашиваем данные пользователя
    console.log(
      "\nСоздание нового пользователя. Пожалуйста, заполните следующие поля:"
    );

    const firstName = await question("Имя: ");
    if (!firstName) {
      throw new Error("Имя не может быть пустым");
    }

    const lastName = await question("Фамилия: ");
    if (!lastName) {
      throw new Error("Фамилия не может быть пустой");
    }

    const email = await question("Email: ");
    if (!email) {
      throw new Error("Email не может быть пустым");
    }

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error(`Пользователь с email ${email} уже существует`);
    }

    // Запрашиваем пароль (дважды для подтверждения)
    const password = await question("Пароль: ");
    if (!password || password.length < 6) {
      throw new Error("Пароль должен содержать минимум 6 символов");
    }

    const confirmPassword = await question("Подтвердите пароль: ");
    if (password !== confirmPassword) {
      throw new Error("Пароли не совпадают");
    }

    // Хешируем пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создаем нового пользователя
    const user = userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Сохраняем пользователя
    const savedUser = await userRepository.save(user);

    console.log("\nПользователь успешно создан:");
    console.log(`ID: ${savedUser.id}`);
    console.log(`Имя: ${savedUser.firstName} ${savedUser.lastName}`);
    console.log(`Email: ${savedUser.email}`);
  } catch (error: any) {
    console.error(`Ошибка: ${error.message}`);
  } finally {
    rl.close();
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(0);
  }
}

// Запускаем функцию создания пользователя
createUser();
