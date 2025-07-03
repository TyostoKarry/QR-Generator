import { useContext, useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { QRContainer } from "./QRContainer";
import { QRDisplay } from "./QRDisplay";
import { StorageQrCodeDetails } from "./StorageQrCodeDetails";
import { useAuthContext } from "../contexts/AuthContext";
import { LanguageContext } from "../contexts/LanguageContext";
import {
  deleteFileFromSupabase,
  getUserFilesFromSupabase,
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

  useEffect(() => {
    if (!hasMounted) return;
    const fetchUserFiles = async () => {
      const getUserFileResult = await getUserFilesFromSupabase(session);
      if (getUserFileResult.status === "error") {
        toast.error(
          lang.toast.supabaseGetUserFile[getUserFileResult.errorType],
        );
        console.error(
          "Error fetching user files:",
          getUserFileResult.errorType,
        );
        navigate("/");
      }
      if (getUserFileResult.status === "success") {
        const files = getUserFileResult.files;
        setQrCodeFiles(files);
      }
    };
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

  return (
    <div className="grid grid-cols-1 gap-4">
      {qrCodeFiles.map((file) => (
        <QRContainer
          key={file.id}
          leftElement={
            <StorageQrCodeDetails file={file} deleteFile={deleteFile} />
          }
          rightElement={
            <QRDisplay qrCodeId={file.id} qrCodePublicUrl={file.public_url} />
          }
        />
      ))}
    </div>
  );
};
