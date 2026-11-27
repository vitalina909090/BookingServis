import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Введіть коректний email"),
  password: z.string().min(1, "Введіть пароль"),
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Вкажіть ім’я та прізвище").max(200),
  email: z.email("Введіть коректний email"),
  phoneNumber: z.string().max(32).optional(),
  password: z
    .string()
    .min(8, "Мінімум 8 символів")
    .regex(/[a-z]/, "Потрібна хоча б одна мала літера")
    .regex(/\d/, "Потрібна хоча б одна цифра"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;