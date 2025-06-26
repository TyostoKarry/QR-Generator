import { supabase } from "./supabase";
import type {
  SupabaseSignOutResult,
  SupabaseSignUpResult,
} from "../types/Supabase";

export const signUp = async (): Promise<SupabaseSignUpResult> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  if (error) return { status: "error", message: error.message };

  return { status: "success" };
};

export const signOut = async (): Promise<SupabaseSignOutResult> => {
  const { error } = await supabase.auth.signOut();
  if (error) return { status: "error", message: error.message };

  return { status: "success" };
};
