import { createContext, useContext } from "react";
import type { FileWithPreview } from "../types/FileWithPreview";
import type { QRInputType } from "../types/QRInputType";

interface QRContextType {
  // QR Code
  qrCode: string;

  // The current QR input type
  qrInputType: QRInputType;
  setQRInputType: (type: QRInputType) => void;

  // Input values for different QR types
  imageFile: FileWithPreview | null;
  setImageFile: (file: FileWithPreview | null) => void;
  pdfFile: FileWithPreview | null;
  setPdfFile: (file: FileWithPreview | null) => void;
  urlInputValue: string;
  setUrlInputValue: (value: string) => void;
  textInputValue: string;
  setTextInputValue: (value: string) => void;

  // Validation states for input values
  imageError: string | null;
  setImageError: (error: string | null) => void;
  pdfError: string | null;
  setPdfError: (error: string | null) => void;
  urlError: string | null;
  setUrlError: (error: string | null) => void;
  textError: string | null;
  setTextError: (error: string | null) => void;

  // Validation logic for input values
  validateInput: () => void;

  // Function to generate the QR code based on the current input type
  generateQRCode: () => void;

  // Function to operate on the QR code, such as copying or downloading
  copyQrCodeToClipboard: () => void;
  downloadQrCode: () => void;
}

export const QRContext = createContext<QRContextType | undefined>(undefined);

export const useQRContext = (): QRContextType => {
  const context = useContext(QRContext);
  if (!context) {
    throw new Error("useQRContext must be used within a QRContextProvider");
  }
  return context;
};
