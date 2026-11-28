export type ProblemBody = {
  title?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const SHOWN_STATUSES = new Set([401, 409, 429]);

export function getErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) {
    return "Не вдалося виконати запит. Перевірте з’єднання та спробуйте ще раз";
  }
  if (error.status >= 500) {
    return "На сервері сталася помилка. Спробуйте пізніше";
  }
  if (SHOWN_STATUSES.has(error.status) && error.message) {
    return error.message;
  }
  return fallback;
}