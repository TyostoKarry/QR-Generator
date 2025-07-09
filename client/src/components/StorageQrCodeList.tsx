import { useContext, useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./Button";
import { QRContainer } from "./QRContainer";
import { QRDisplay } from "./QRDisplay";
import { StorageQrCodeDetails } from "./StorageQrCodeDetails";
import { useAuthContext } from "../contexts/AuthContext";
import { LanguageContext } from "../contexts/LanguageContext";
import {
  deleteFileFromSupabase,
  getUserFilesFromSupabase,
  updateUserFileMetadataTimestamp,
} from "../services/storageService";
import type { SupabaseUserFilesSchema } from "../types/Supabase";

export const StorageQrCodeList: FC = () => {
  const lang = useContext(LanguageContext);
  const navigate = useNavigate();
  const { session } = useAuthContext();
  const [qrCodeFiles, setQrCodeFiles] = useState<SupabaseUserFilesSchema[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Set hasMounted to true after the initial render to ensure the sessuion is available
    setHasMounted(true);
  }, []);

  const fetchUserFiles = async () => {
    const getUserFileResult = await getUserFilesFromSupabase(session);
    if (getUserFileResult.status === "error") {
      toast.error(lang.toast.supabaseGetUserFile[getUserFileResult.errorType]);
      console.error("Error fetching user files:", getUserFileResult.errorType);
      navigate("/");
    }
    if (getUserFileResult.status === "success") {
      const files = getUserFileResult.files;
      setQrCodeFiles(files);
    }
  };

  useEffect(() => {
    if (!hasMounted) return;
    fetchUserFiles();
  }, [hasMounted, lang.toast.supabaseGetUserFile, navigate, session]);

  const deleteFile = async (fileName: string) => {
    const deleteResult = await deleteFileFromSupabase(fileName, session);
    if (deleteResult.status === "error") {
      toast.error(lang.toast.supabaseDeleteFile[deleteResult.errorType]);
      console.error("Error deleting file:", deleteResult.errorType);
      return;
    }
    setQrCodeFiles((prevFiles) =>
      prevFiles.filter((file) => file.file_name !== fileName),
    );
    toast.success(lang.toast.supabaseDeleteFile.success);
  };

  const refreshDeleteDate = async (fileId: string) => {
    const updateResult = await updateUserFileMetadataTimestamp(fileId, session);
    if (updateResult.status === "error") {
      toast.error(
        lang.toast.supabaseUpdateFileMetadataTimestamp[updateResult.errorType],
      );
      console.error(
        "Error updating file metadata timestamp:",
        updateResult.errorType,
      );
      return;
    }
    toast.success(lang.toast.supabaseUpdateFileMetadataTimestamp.success);
    fetchUserFiles();
  };

  if (qrCodeFiles.length === 0)
    return (
      <div className="flex flex-col items-center justify-center pt-80 gap-4">
        <h1 className="text-2xl font-medium text-text text-shadow-sm">
          {lang.storage.noFilesTitle}
        </h1>
        <p className="text-text/90 text-sm">
          {lang.storage.noFilesDescription}
        </p>
        <Button
          label={lang.buttons.startGenerating}
          onClick={() => navigate("/")}
        />
      </div>
    );

  return (
    <div className="grid grid-cols-1 gap-4 py-24">
      {qrCodeFiles.map((file) => (
        <QRContainer
          key={file.id}
          leftElement={
            <StorageQrCodeDetails
              file={file}
              deleteFile={deleteFile}
              refreshDeleteDate={refreshDeleteDate}
            />
          }
          rightElement={
            <QRDisplay qrCodeId={file.id} qrCodePublicUrl={file.public_url} />
          }
        />
      ))}
    </div>
  );
};
