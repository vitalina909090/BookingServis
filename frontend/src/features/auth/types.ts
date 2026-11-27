export type User = {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  roles: string[];
};

export type AuthResponse = {
  accessToken: string;
  expiresAtUtc: string;
  user: User;
};