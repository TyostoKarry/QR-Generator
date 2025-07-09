import { useContext, type FC } from "react";
import { Button } from "./Button";
import PdfIcon from "../assets/icons/pdf.svg";
import RefreshIcon from "../assets/icons/refresh.svg?react";
import { LanguageContext } from "../contexts/LanguageContext";
import type { SupabaseUserFilesSchema } from "../types/Supabase";
import { getFilePreviewType } from "../utils/getFilePreviewType";
import { truncateFileName } from "../utils/truncateFileName";

interface StorageQrCodeDetailsProps {
  file: SupabaseUserFilesSchema;
  deleteFile: (fileName: string) => void;
  refreshDeleteDate: (fileId: string) => void;
}

export const StorageQrCodeDetails: FC<StorageQrCodeDetailsProps> = ({
  file,
  deleteFile,
  refreshDeleteDate,
}) => {
  const lang = useContext(LanguageContext);

  const fileType = getFilePreviewType(file.file_name);

  const autoDeleteDate = new Date(file.updated_at);
  autoDeleteDate.setDate(autoDeleteDate.getDate() + 7);

  const formatAutoDeleteDate = autoDeleteDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const autoDeleteTime = autoDeleteDate.getHours() < 12 ? "12:00" : "00:00";

  const fileUpdatedAt = new Date(file.updated_at);
  const today = new Date();
  const isCurrentDate =
    fileUpdatedAt.getFullYear() === today.getFullYear() &&
    fileUpdatedAt.getMonth() === today.getMonth() &&
    fileUpdatedAt.getDate() === today.getDate();

  return (
    <section className="flex flex-col justify-between items-center text-center w-full">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-2xl font-medium text-text text-shadow-sm">
          {lang.storage.detailsTitle}
        </h1>
        {fileType === "unknown" ? (
          <p>{lang.storage.previewNotAvailable}</p>
        ) : (
          <img
            src={fileType === "image" ? file.public_url : PdfIcon}
            alt={file.file_name}
            className="max-w-50 max-h-50 cursor-pointer"
            onClick={() => window.open(file.public_url, "_blank")}
          />
        )}
      </div>
      <div className="flex flex-col items-center w-full">
        <p className="text-text/80 text-sm">{lang.storage.fileName}</p>
        <p title={file.file_name.split("@")[1]} className="text-text text-m">
          {truncateFileName(file.file_name.split("@")[1], 13)}
        </p>
      </div>
      <div className="flex flex-col w-full">
        <p className="text-text/80 text-sm">{lang.storage.automaticDeleteAt}</p>
        <div className="flex flex-row items-center justify-between w-full">
          <p className="text-text text-m">{`${formatAutoDeleteDate} ${lang.storage.at} ${autoDeleteTime}`}</p>
          <div
            className="h-6 w-6 flex items-center justify-center"
            title={
              isCurrentDate
                ? lang.storage.automaticDeleteAtRefreshTooltipDisabled
                : lang.storage.automaticDeleteAtRefreshTooltip
            }
          >
            <RefreshIcon
              className={`h-5 w-5 ${isCurrentDate ? "" : "hover:h-5.5 hover:w-5.5 active:h-5 active:w-5 cursor-pointer"}`}
              onClick={() => (isCurrentDate ? {} : refreshDeleteDate(file.id))}
              fill={isCurrentDate ? "#bbbbbb" : "#000000"}
            />
          </div>
        </div>
      </div>
      <Button
        label={lang.buttons.deleteFile}
        onClick={() => deleteFile(file.file_name)}
        variant="danger"
        className="w-full"
      />
    </section>
  );
};
