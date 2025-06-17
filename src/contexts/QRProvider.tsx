import { useEffect, useState, type FC, type ReactNode } from "react";
import { QRContext } from "./qrContext";
import type { QRInputType } from "../types/QRInputType";

interface QRProviderProps {
  children: ReactNode;
}

export const QRProvider: FC<QRProviderProps> = ({ children }) => {
  // Current QR input type state
  const [qrInputType, setQRInputType] = useState<QRInputType>("url");

  // Input value states for different QR types
  const [urlInputValue, setUrlInputValue] = useState<string>("");
  const [textInputValue, setTextInputValue] = useState<string>("");

  // Validation states for input values
  const [urlError, setUrlError] = useState<string | null>(null);
  const [textError, setTextError] = useState<string | null>(null);

  // Reset input errors when QR input type changes and no input is provided
  useEffect(() => {
    if (qrInputType === "url" && !urlInputValue) {
      setUrlError(null);
    }
    if (qrInputType === "text" && !textInputValue) {
      setTextError(null);
    }
  }, [qrInputType, urlInputValue, textInputValue]);

  // Input value validation
  const validateInput = (): void => {
    // Validate URL input
    setUrlInputValue(urlInputValue.trim());
    if (qrInputType === "url") {
      if (!urlInputValue) {
        setUrlError("URL cannot be empty");
        return;
      }
      try {
        new URL(urlInputValue);
        setUrlError(null);
      } catch {
        setUrlError("Invalid URL format");
      }
      return;
    }

    // Validate text input
    if (qrInputType === "text") {
      setTextInputValue(textInputValue.trim());
      if (!textInputValue) {
        setTextError("Text cannot be empty");
        return;
      }
      if (textInputValue.length > 2000) {
        setTextError("Text exceeds maximum length of 2000 characters");
        return;
      }
      setTextError(null);
      return;
    }
  };

  const value = {
    qrInputType,
    setQRInputType,
    urlInputValue,
    setUrlInputValue,
    textInputValue,
    setTextInputValue,
    urlError,
    setUrlError,
    textError,
    setTextError,
    validateInput,
  };

  return <QRContext.Provider value={value}>{children}</QRContext.Provider>;
};
