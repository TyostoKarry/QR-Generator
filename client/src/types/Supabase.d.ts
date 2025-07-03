import type { AuthError } from "@supabase/supabase-js";

export type SupabaseUserFilesSchema = {
  id: string;
  user_id: string;
  file_name: string;
  public_url: string;
  created_at: string;
  updated_at: string;
};

export type SupabaseSignOutResult =
  | { status: "success" }
  | { status: "error"; error: AuthError };

export type SupabaseSignUpResult =
  | { status: "success" }
  | { status: "error"; error: AuthError };

export type SupabaseStorageDeleteResult =
  | { status: "success" }
  | {
      status: "error";
      errorType: "deleteFailed" | "sessionError";
    };

export type SupabaseStorageGetUserFilesResult =
  | {
      status: "success";
      files: Array<SupabaseUserFilesSchema>;
    }
  | { status: "error"; errorType: "filesError" | "sessionError" };

export type SupabaseStorageUploadResult =
  | { status: "success"; publicUrl: string }
  | {
      status: "error";
      errorType:
        | "fileCountExceeded"
        | "fileCountFetchError"
        | "publicUrlError"
        | "uploadFailed"
        | "sessionError";
    };
