import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/shared/api/baseApi";
import { useAuthStore } from "./store";
import type { AuthResponse, User } from "./types";
import type { LoginValues, RegisterValues } from "./schemas";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (values: LoginValues) =>
      apiFetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      }),
    onSuccess: (data) => setAuth(data.accessToken, data.user),
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (values: RegisterValues) =>
      apiFetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber || null,
          password: values.password,
        }),
      }),
    onSuccess: (data) => setAuth(data.accessToken, data.user),
  });
}

export function useMe() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["me", token],
    queryFn: () => apiFetch<User>("/api/auth/me"),
    enabled: !!token,
  });
}