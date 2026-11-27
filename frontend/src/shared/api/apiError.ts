export type ProblemBody = {
  title?: string;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors: Record<string, string[]> = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  get allMessages(): string[] {
    const fromFields = Object.values(this.fieldErrors).flat();
    return fromFields.length > 0 ? fromFields : [this.message];
  }
}