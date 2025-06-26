export type SupabaseSignOutResult =
  | { status: "success" }
  | { status: "error"; message: string };

export type SupabaseSignUpResult =
  | { status: "success" }
  | { status: "error"; message: string };

export type SupabaseStorageUploadResult =
  | { status: "success"; publicUrl: string }
  | { status: "error"; errorType: "sessionError" }
  | { status: "error"; errorType: "uploadFailed" }
  | { status: "error"; errorType: "publicUrlError" };
