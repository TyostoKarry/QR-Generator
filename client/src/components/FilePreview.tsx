import type { FC } from "react";
import PdfIcon from "../assets/icons/pdf.svg";
import RemoveIcon from "../assets/icons/remove.svg?react";
import type { FileWithPreview } from "../types/FileWithPreview";
import { getFilePreviewType } from "../utils/getFilePreviewType";
import { truncateFileName } from "../utils/truncateFileName";

interface FilePreviewProps {
  file: FileWithPreview;
  setFile: (file: FileWithPreview | null) => void;
}

export const FilePreview: FC<FilePreviewProps> = ({ file, setFile }) => {
  const handleRemoveFile = () => {
    URL.revokeObjectURL(file.preview);
    setFile(null);
  };

  const fileType = getFilePreviewType(file.name);

  return (
    <div className="flex flex-col justify-between h-40">
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-center relative h-32 w-37">
          {fileType === "pdf" ? (
            <img
              src={PdfIcon}
              alt="PDF Icon"
              className="h-32 w-32 cursor-pointer"
              onClick={() => window.open(file.preview, "_blank")}
            />
          ) : (
            <img
              src={file.preview}
              alt="image file"
              className="h-32 cursor-pointer"
              onClick={() => window.open(file.preview, "_blank")}
            />
          )}
          <RemoveIcon
            stroke="#ffffff"
            aria-label={`Remove ${fileType === "pdf" ? "PDF" : "Image"}`}
            className="absolute top-1 right-1 h-6 w-6 bg-red-400 rounded-full p-1 cursor-pointer hover:bg-red-500"
            onClick={handleRemoveFile}
          />
        </div>
      </div>
      <p title={file.name} className="text-text text-shadow-xs">
        {truncateFileName(file.name, 35)}
      </p>
    </div>
  );
};
