import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import type { SupabaseStorageUploadResult } from "../types/Supabase";

export const uploadFileToSupabase = async (
  file: File,
  session: Session | null,
): Promise<SupabaseStorageUploadResult> => {
  if (!session || !session.user)
    return { status: "error", errorType: "sessionError" };

  const filePath = `${Date.now()}@${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("qr-files")
    .upload(filePath, file);

  if (uploadError) {
    console.error("File upload error:", uploadError.message);
    return { status: "error", errorType: "uploadFailed" };
  }

  const { data: publicUrlData } = await supabase.storage
    .from("qr-files")
    .getPublicUrl(filePath);

  if (!publicUrlData || !publicUrlData.publicUrl)
    return { status: "error", errorType: "publicUrlError" };

  return {
    status: "success",
    publicUrl: publicUrlData.publicUrl,
  };
};
