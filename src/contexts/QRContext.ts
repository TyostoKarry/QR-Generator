import { createContext, useContext } from "react";
import type { QRInputType } from "../types/QRInputType";

interface QRContextType {
  // QR Code
  qrCode: string;

  // The current QR input type
  qrInputType: QRInputType;
  setQRInputType: (type: QRInputType) => void;

  // Input values for different QR types
  urlInputValue: string;
  setUrlInputValue: (value: string) => void;
  textInputValue: string;
  setTextInputValue: (value: string) => void;

  // Validation states for input values
  urlError: string | null;
  setUrlError: (error: string | null) => void;
  textError: string | null;
  setTextError: (error: string | null) => void;

  // Validation logic for input values
  validateInput: () => void;

  // Function to generate the QR code based on the current input type
  generateQRCode: () => void;
}

export const QRContext = createContext<QRContextType | undefined>(undefined);

export const useQRContext = (): QRContextType => {
  const context = useContext(QRContext);
  if (!context) {
    throw new Error("useQRContext must be used within a QRContextProvider");
  }
  return context;
};
