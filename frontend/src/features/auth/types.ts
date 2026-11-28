export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  roles: string[];
};

export type AuthResponse = {
  accessToken: string;
  expiresAtUtc: string;
  user: User;
};