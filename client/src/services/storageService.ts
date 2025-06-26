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

  const filePath = `${Date.now()}@${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("qr-files")
    .upload(filePath, file);

  if (uploadError) {
    toast.error(`Error uploading file: ${uploadError.message}`);
    return null;
  }

  const { data: publicUrlData } = await supabase.storage
    .from("qr-files")
    .getPublicUrl(filePath);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    toast.error("Error retrieving public URL for the uploaded file.");
    return null;
  }

  toast.success("File uploaded successfully!");

  return publicUrlData.publicUrl;
};
