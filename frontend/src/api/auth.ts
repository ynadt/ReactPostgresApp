import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export interface AuthResponse {
  token: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, { email, password });
  return response.data;
};

export const register = async (
    name: string,
    email: string,
    password: string
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/register`, {
    name,
    email,
    password,
  });
  return response.data;
};
