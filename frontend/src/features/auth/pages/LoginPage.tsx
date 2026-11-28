import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { useLogin } from "@/features/auth/api";
import { loginSchema, type LoginValues } from "@/features/auth/schemas";
import { getErrorMessage } from "@/shared/api/apiError";
import { FormField } from "@/shared/components/FormField";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginValues) =>
    login.mutate(values, { onSuccess: () => navigate("/profile") });

  return (
    <div className="max-w-md p-6">
      <h1 className="mb-4 text-xl font-bold">Увійти</h1>
      {login.isError && (
        <p role="alert" className="mb-3 text-sm text-red-500">
          {getErrorMessage(login.error, "Помилка входу. Спробуйте ще раз.")}
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
        <FormField
          label="Email *"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          label="Пароль *"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <button
          type="submit"
          disabled={login.isPending}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {login.isPending ? "Входимо..." : "Увійти"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Немає облікового запису?{" "}
        <Link to="/register" className="text-blue-600">
          Зареєструватися
        </Link>
      </p>
    </div>
  );
}
