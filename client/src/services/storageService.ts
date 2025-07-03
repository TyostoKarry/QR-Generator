import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import type {
  SupabaseStorageDeleteResult,
  SupabaseStorageGetUserFilesResult,
  SupabaseStorageUploadResult,
} from "../types/Supabase";

const checkUserFileCount = async (
  userId: string,
): Promise<number | SupabaseStorageUploadResult> => {
  const { data: tableData, error: tableError } = await supabase
    .from("user_file_counts")
    .select("file_count")
    .eq("user_id", userId)
    .single();

  if (tableError && tableError.code === "PGRST116") return 0; // No record found, user has no files

  if (tableData && tableData.file_count >= 3)
    return { status: "error", errorType: "fileCountExceeded" };

  if (tableError) {
    console.error("Error fetching file count:", tableError);
    return { status: "error", errorType: "fileCountFetchError" };
  }

  return tableData.file_count;
};

export const deleteFileFromSupabase = async (
  fileName: string,
  session: Session | null,
): Promise<SupabaseStorageDeleteResult> => {
  if (!session || !session.user)
    return { status: "error", errorType: "sessionError" };

  const { error: deleteError } = await supabase.storage
    .from("qr-files")
    .remove([fileName]);

  if (deleteError) {
    console.error("File deletion error:", deleteError);
    return { status: "error", errorType: "deleteFailed" };
  }

  return { status: "success" };
};

export const getUserFilesFromSupabase = async (
  session: Session | null,
): Promise<SupabaseStorageGetUserFilesResult> => {
  if (!session || !session.user)
    return { status: "error", errorType: "sessionError" };

  const { data: files, error: filesError } = await supabase
    .from("user_files")
    .select("*")
    .eq("user_id", session.user.id);

  if (filesError) {
    console.error("Error fetching user files:", filesError);
    return { status: "error", errorType: "filesError" };
  }

  return {
    status: "success",
    files: files,
  };
};

export const uploadFileToSupabase = async (
  file: File,
  session: Session | null,
): Promise<SupabaseStorageUploadResult> => {
  if (!session || !session.user)
    return { status: "error", errorType: "sessionError" };

  // Check if the user has reached the file upload limit
  const fileCount = await checkUserFileCount(session.user.id);
  if (typeof fileCount !== "number") return fileCount;

  const filePath = `${Date.now()}@${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("qr-files")
    .upload(filePath, file);

  if (uploadError) {
    console.error("File upload error:", uploadError);
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
