import { useAuthStore } from "@/features/auth/store";
import { ApiError, type ProblemBody } from "./apiError";


export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token;

  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(path, { ...init, headers });

  if (!response.ok) {
    const body: ProblemBody = await response.json().catch(() => ({}));

    if (response.status === 401 && token) {
      useAuthStore.getState().logout();
    }

    throw new ApiError(response.status, body.title ?? "Помилка", body.errors ?? {});
  }

  return (await response.json()) as T;
}