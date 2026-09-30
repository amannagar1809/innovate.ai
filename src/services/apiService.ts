import api from "@/lib/axios";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiErrorShape {
  message: string;
  status?: number;
}

class ApiService {
  async get<T>(url: string, config?: Record<string, unknown>) {
    const response = await api.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T>(url: string, body?: unknown, config?: Record<string, unknown>) {
    const response = await api.post<ApiResponse<T>>(url, body, config);
    return response.data;
  }

  async put<T>(url: string, body?: unknown, config?: Record<string, unknown>) {
    const response = await api.put<ApiResponse<T>>(url, body, config);
    return response.data;
  }

  async patch<T>(url: string, body?: unknown, config?: Record<string, unknown>) {
    const response = await api.patch<ApiResponse<T>>(url, body, config);
    return response.data;
  }

  async delete<T>(url: string, config?: Record<string, unknown>) {
    const response = await api.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

export const apiService = new ApiService();

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    return axiosError.response?.data?.message ?? axiosError.message ?? "Something went wrong";
  }

  return "Something went wrong";
};
