import type { AuthError } from "@supabase/supabase-js";

export type SupabaseSignOutResult =
  | { status: "success" }
  | { status: "error"; error: AuthError };

export type SupabaseSignUpResult =
  | { status: "success" }
  | { status: "error"; error: AuthError };

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
