import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { useRegister } from "@/features/auth/api";
import { registerSchema, type RegisterValues } from "@/features/auth/schemas";
import { getErrorMessage } from "@/shared/api/apiError";
import { FormField } from "@/shared/components/FormField";

export function RegisterPage() {
  const navigate = useNavigate();
  const registerUser = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = (values: RegisterValues) =>
    registerUser.mutate(values, { onSuccess: () => navigate("/profile") });

  return (
    <div className="max-w-md p-6">
      <h1 className="mb-4 text-xl font-bold">Реєстрація</h1>
      {registerUser.isError && (
        <p role="alert" className="mb-3 text-sm text-red-500">
          {getErrorMessage(
            registerUser.error,
            "Помилка реєстрації. Спробуйте ще раз.",
          )}
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Ім’я *"
            autoComplete="given-name"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <FormField
            label="Прізвище *"
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>
        <FormField
          label="Email *"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          label="Телефон (необов’язково)"
          type="tel"
          autoComplete="tel"
          error={errors.phoneNumber?.message}
          {...register("phoneNumber")}
        />
        <FormField
          label="Пароль *"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <button
          type="submit"
          disabled={registerUser.isPending}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {registerUser.isPending ? "Створюємо..." : "Зареєструватися"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Вже є обліковий запис?{" "}
        <Link to="/login" className="text-blue-600">
          Увійти
        </Link>
      </p>
    </div>
  );
}
