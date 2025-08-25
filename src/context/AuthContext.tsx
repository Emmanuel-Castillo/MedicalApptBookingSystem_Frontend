import { createContext, useContext, useEffect, useState } from "react";
import { UserRole } from "../types/dtos";
import { NavigateFunction } from "react-router-dom";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  token: string;
};
type AuthContextType = {
  user: AuthUser | null;
  loadingUser: boolean;
  logIn: (userData: AuthUser) => void;
  logOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const LOCAL_STORAGE_AUTH_KEY = "auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Inject User model information when context is invoked
  useEffect(() => {

    // If user is already saved from 
    if (!loadingUser && user) return;
    console.log("Calling context")

    const storedAuth = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    if (storedAuth) {
      setUser(JSON.parse(storedAuth) as AuthUser);
    } 

    setLoadingUser(false)
  }, []);

  useEffect(() => {
    if (user) {
      setLoadingUser(false);
    }
  }, [user]);

  const logIn = (userData: AuthUser) => {
    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const logOut = () => {
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    setUser(null);
    setLoadingUser(true)
  };

  return (
    <AuthContext.Provider value={{ user, loadingUser, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// React hook to use user data context provided by UserDatContext.Provider
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContext.Provider");
  }
  return context;
}
