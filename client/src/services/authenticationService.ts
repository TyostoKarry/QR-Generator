import { toast } from "sonner";
import { supabase } from "./supabase";

export const signUp = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  if (error) {
    toast.error(`Error signing up: ${error.message}`);
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    toast.error(`Error signing out: ${error.message}`);
  } else {
    toast.success("Signed out successfully");
  }
};
