import { create } from "zustand";
import { UserLoginDto, UserRegisterDto, UserRole } from "../types/dtos";
import { validateForm } from "../utils/ValidateAuthForm";
import api from "../api/axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

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

  register: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => void;
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
  register: async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => {
    set({ isLoading: true });
    const toastId = toast.loading(
      "Loading...\nExpect cold start from Azure's services (30s - 60s)"
    );
    try {
      const validationErrors = validateForm(email, password, fullName);
      if (validationErrors.length > 0) {
        throw Error("Validation failed.");
      }

      const dto: UserRegisterDto = {
        FullName: fullName,
        Email: email,
        Password: password,
        Role: role,
      };
      const { data } = await api.post("/auth/register", dto);
      const { token, userDto } = data;
      localStorage.setItem(LOCAL_STORAGE_AUTH_TOKEN, token);
      set({ user: userDto, token: token, isAuthenticated: true });
    } catch (e: any) {
      let errors = [];
      if (e instanceof AxiosError) {
        errors.push(e.response?.data || "Axios Error");
      } else {
        errors.push(e?.message || "Unknown Error");
      }
      set({ isAuthenticated: false, user: null, errors: errors, token: null });
    } finally {
      set({ isLoading: false });
      toast.dismiss(toastId);
    }
  },
  logIn: async (email: string, password: string) => {
    set({ isLoading: true });
    const toastId = toast.loading(
      "Loading...\nExpect cold start from Azure's services (30s - 60s)"
    );
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
      let errors = [];
      if (e instanceof AxiosError) {
        errors.push(e.response?.data || "Axios Error");
      } else {
        errors.push(e?.message || "Unknown Error");
      }
      set({ isAuthenticated: false, user: null, errors: errors, token: null });
    } finally {
      set({ isLoading: false });
      toast.dismiss(toastId);
    }
  },
  logOut: () => {
    localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN);
    set({ user: null, token: null, isAuthenticated: false });
  },
  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });
    const toastId = toast.loading(
      "Loading...\nExpect cold start from Azure's services (30s - 60s)"
    );
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
      toast.dismiss(toastId);
    }
  },
}));
