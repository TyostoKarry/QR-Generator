import type { FC } from "react";
import PdfIcon from "../assets/icons/pdf.svg";
import RemoveIcon from "../assets/icons/remove.svg";
import { useQRContext } from "../contexts/QRContext";

export const PdfPreview: FC = () => {
  const { pdfFile, setPdfFile } = useQRContext();

  if (!pdfFile) {
    return null; // Return null if no PDF file is selected
  }

  return (
    <div className="flex flex-col justify-between h-40">
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-center relative h-32 w-37">
          <img
            src={PdfIcon}
            alt="PDF Icon"
            className="h-32 w-32 cursor-pointer"
            onClick={() => window.open(pdfFile.preview, "_blank")}
          />
          <img
            src={RemoveIcon}
            alt="Remove Icon"
            aria-label="Remove PDF"
            className="absolute top-1 right-1 h-6 w-6 bg-red-400 rounded-full p-1 cursor-pointer hover:bg-red-500"
            onClick={() => {
              URL.revokeObjectURL(pdfFile.preview);
              setPdfFile(null);
            }}
          />
        </div>
      </div>
      <p className="text-text text-shadow-xs">{pdfFile.name}</p>
    </div>
  );
};
