import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string("Введіть email")
    .trim()
    .min(1, "Введіть email")
    .pipe(z.email("Введіть коректний email")),
  password: z.string("Введіть пароль").min(1, "Введіть пароль"),
});

export const registerSchema = z.object({
  firstName: z
    .string("Введіть ім’я")
    .trim()
    .min(1, "Введіть ім’я")
    .min(2, "Ім’я занадто коротке (мін. 2 символи)")
    .max(100, "Ім’я занадто довге (макс. 100 символів)"),
  lastName: z
    .string("Введіть прізвище")
    .trim()
    .min(1, "Введіть прізвище")
    .min(2, "Прізвище занадто коротке (мін. 2 символи)")
    .max(100, "Прізвище занадто довге (макс. 100 символів)"),
  email: z
    .string("Введіть email")
    .trim()
    .min(1, "Введіть email")
    .max(256, "Email занадто довгий (макс. 256 символів)")
    .pipe(z.email("Введіть коректний email")),
  phoneNumber: z
    .string()
    .max(32, "Телефон занадто довгий (макс. 32 символи)")
    .optional(),
  password: z
    .string("Введіть пароль")
    .min(1, "Введіть пароль")
    .min(8, "Пароль занадто короткий (мін. 8 символів)")
    .max(128, "Пароль занадто довгий (макс. 128 символів)")
    .regex(/[a-z]/, "Пароль має містити хоча б одну маленьку латинську літеру")
    .regex(/[A-Z]/, "Пароль має містити хоча б одну велику латинську літеру")
    .regex(/\d/, "Пароль має містити хоча б одну цифру")
    .regex(
      /[^\p{L}\p{N}]/u,
      "Пароль має містити хоча б один спеціальний символ",
    ),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;