import { apiService, type ApiResponse } from "@/services/apiService";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
  mobileNumber: string;
}

export interface SignupUserPayload {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPayload {
  id?: string;
  name?: string;
  email: string;
}

interface AuthPayload {
  user: UserPayload;
  token: string;
}

type JsonRecord = Record<string, unknown>;
const STORED_USER_KEY = "auth_user";

const asRecord = (value: unknown): JsonRecord | undefined =>
  typeof value === "object" && value !== null ? value as JsonRecord : undefined;

const firstString = (...values: unknown[]): string | undefined =>
  values.find((value): value is string => typeof value === "string" && value.length > 0);

const normalizeUser = (value: unknown, fallbackEmail?: string): UserPayload => {
  const user = asRecord(value) ?? {};
  const email = firstString(user.email, fallbackEmail);

  if (!email) {
    throw new Error("The login response did not include a user email.");
  }

  return {
    id: firstString(user.id, user._id),
    name: firstString(user.name, user.fullName),
    email,
  };
};

const normalizeLoginResponse = (value: unknown, fallbackEmail: string): ApiResponse<AuthPayload> => {
  const response = asRecord(value) ?? {};
  const responseData = asRecord(response.data) ?? response;
  const payload = asRecord(responseData.data) ?? responseData;
  const message = firstString(response.message, responseData.message);

  if (response.success === false || responseData.success === false) {
    throw new Error(message ?? "Unable to sign in.");
  }

  const token = firstString(
    payload.token,
    payload.accessToken,
    payload.access_token,
    responseData.token,
    responseData.accessToken,
    responseData.access_token,
    response.token,
    response.accessToken,
    response.access_token
  );

  if (!token) {
    throw new Error(message ?? "The login response did not include an access token.");
  }

  const user = payload.user ?? responseData.user ?? response.user ?? payload;

  return {
    success: true,
    message,
    data: { token, user: normalizeUser(user, fallbackEmail) },
  };
};

export const authService = {
  login: async (payload: LoginPayload) => {
    const response = await apiService.post<unknown>("/auth/login", payload);
    const normalized = normalizeLoginResponse(response, payload.email);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("access_token", normalized.data.token);
      window.localStorage.setItem(STORED_USER_KEY, JSON.stringify(normalized.data.user));
    }

    return normalized;
  },
  register: async (payload: SignupPayload) =>
    apiService.post<SignupUserPayload>("/auth/signup", payload),
  getStoredUser: (): UserPayload | null => {
    if (typeof window === "undefined") return null;

    try {
      const storedUser = window.localStorage.getItem(STORED_USER_KEY);
      return storedUser ? normalizeUser(JSON.parse(storedUser)) : null;
    } catch {
      window.localStorage.removeItem(STORED_USER_KEY);
      return null;
    }
  },
  clearLocalSession: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("access_token");
      window.localStorage.removeItem(STORED_USER_KEY);
    }
  },
  logout: async () => {
    try {
      await apiService.post("/auth/logout");
    } finally {
      authService.clearLocalSession();
    }
  },
};
