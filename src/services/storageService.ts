import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "./supabase";

export const uploadFileToSupabase = async (
  file: File,
  session: Session | null,
): Promise<string | null> => {
  if (!session || !session.user) {
    toast.error("User session is not available. Please log in.");
    return null;
  }
  const filePath = `${file.name}@${Date.now()}`;

  const { error: storageError } = await supabase.storage
    .from("qr-files")
    .upload(filePath, file);

  if (storageError) {
    toast.error(`Error uploading file: ${storageError.message}`);
    return null;
  }

  const { data } = await supabase.storage
    .from("qr-files")
    .getPublicUrl(filePath);

  toast.success("File uploaded successfully!");

  return data.publicUrl;
};
