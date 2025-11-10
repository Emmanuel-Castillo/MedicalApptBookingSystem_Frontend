import { create } from "zustand";
import { UserLoginDto, UserRole } from "../types/dtos";
import { validateForm } from "../utils/ValidateAuthForm";
import api from "../api/axios";
import { AxiosError } from "axios";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  token: string;
};
interface AuthStore {
  user: AuthUser | null;
  token: string | null;

  isAuthenticated: boolean;
  isLoading: boolean;
  errors: string[];

  logIn: (email: string, password: string) => void;
  logOut: () => void;

  fetchAuthenticatedUser: () => void;
}
export const LOCAL_STORAGE_AUTH_TOKEN = "token";
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  errors: [],
  logIn: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const validationErrors = validateForm(email, password);
      if (validationErrors.length > 0) {
        throw Error("Validation failed.");
      }

      const loginDto: UserLoginDto = {
        Email: email,
        Password: password,
      };

      const { data } = await api.post("/auth/login", loginDto);
      const { token, userDto } = data;
      localStorage.setItem(LOCAL_STORAGE_AUTH_TOKEN, token);
      set({ user: userDto, token: token, isAuthenticated: true });
    } catch (e: any) {
      console.error();
      let errors = [];
      if (e instanceof AxiosError) {
        errors.push(e.response?.data || "Axios Error");
      } else {
        errors.push(e?.message || "Unknown Error");
      }
      set({ isAuthenticated: false, user: null, errors: errors });
    } finally {
      set({ isLoading: false });
    }
  },
  logOut: () => {
    localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN);
    set({ user: null, token: null, isAuthenticated: false });
  },
  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN);
      if (!token) throw Error("Token doesn't exist");
      set({ token: token });

      const { data } = await api.get("/users/me");
      set({ user: data.userDto, isAuthenticated: true });
    } catch (e: any) {
      console.error("fetchAuthenticatedUser", e);
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
