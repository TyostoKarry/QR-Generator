import type { Session } from "@supabase/supabase-js";
import { signOut } from "./authenticationService";
import { supabase } from "./supabase";
import type {
  SupabaseDeleteUserAccountResult,
  SupabaseStorageDeleteResult,
  SupabaseStorageGetUserFilesResult,
  SupabaseStorageUploadResult,
  SupabaseUpdateUserFileMetadataResult,
} from "../types/Supabase";

const checkUserFileCount = async (
  userId: string,
): Promise<number | SupabaseStorageUploadResult> => {
  const { data: tableData, error: tableError } = await supabase
    .from("user_files")
    .select("*")
    .eq("user_id", userId);

  if (tableData && tableData.length >= 3)
    return { status: "error", errorType: "fileCountExceeded" };

  if (tableError) {
    console.error("Error fetching file count:", tableError);
    return { status: "error", errorType: "fileCountFetchError" };
  }

  return tableData.length;
};

export const deleteUserAccountFromSupabase = async (
  session: Session | null,
): Promise<SupabaseDeleteUserAccountResult> => {
  if (!session || !session.user)
    return { status: "error", errorType: "sessionError" };

  try {
    const { data: deleteUserData, error: deleteUserError } =
      await supabase.functions.invoke("delete-account", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

    if (deleteUserError) {
      console.error("Error deleting user account:", deleteUserError);
      return { status: "error", errorType: "accountDeleteError" };
    }

    if (!deleteUserData || !deleteUserData.success) {
      console.error("Delete user function did not return success");
      return { status: "error", errorType: "accountDeleteError" };
    }
  } catch (error) {
    console.error("Error invoking delete user function:", error);
    return { status: "error", errorType: "accountDeleteError" };
  }

  const logoutResult = await signOut();
  if (logoutResult.status === "error") {
    console.error("Error signing out:", logoutResult.error);
    return { status: "error", errorType: "signOutError" };
  }

  return { status: "success" };
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

export const updateUserFileMetadataTimestamp = async (
  fileId: string,
  session: Session | null,
): Promise<SupabaseUpdateUserFileMetadataResult> => {
  if (!session || !session.user)
    return { status: "error", errorType: "sessionError" };

  const { error: updateError } = await supabase
    .from("user_files")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", fileId)
    .eq("user_id", session.user.id);

  if (updateError) {
    console.error("Error updating file metadata timestamp:", updateError);
    return { status: "error", errorType: "updateFailed" };
  }

  return { status: "success" };
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
