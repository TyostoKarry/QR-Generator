import type { FilePreviewType } from "../types/FilePreviewType";

export const getFilePreviewType = (fileName: string): FilePreviewType => {
  if (
    fileName.endsWith(".png") ||
    fileName.endsWith(".jpg") ||
    fileName.endsWith(".jpeg") ||
    fileName.endsWith(".gif")
  ) {
    return "image";
  }
  if (fileName.endsWith(".pdf")) {
    return "pdf";
  }
  return "unknown";
};
