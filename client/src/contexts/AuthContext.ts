import type { Session } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

interface AuthContextType {
  session: Session | null;
}

// Create the context with a default value of `undefined`
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
