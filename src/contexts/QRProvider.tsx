import {
  useContext,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { LanguageContext } from "./LanguageContext";
import { QRContext } from "./QRContext";
import type { QRInputType } from "../types/QRInputType";

interface QRProviderProps {
  children: ReactNode;
}

export const QRProvider: FC<QRProviderProps> = ({ children }) => {
  const lang = useContext(LanguageContext);
  // QR Code state
  const [qrCode, setQRCode] = useState<string>("");

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

  // Reset input errors when input values change
  useEffect(() => {
    setUrlError(null);
    setTextError(null);
  }, [urlInputValue, textInputValue]);

  // Input value validation
  const getValidationResult = (): {
    isValid: boolean;
    error: string | null;
  } => {
    if (qrInputType === "url") {
      const trimmedUrl = urlInputValue.trim();
      if (!trimmedUrl) {
        return { isValid: false, error: lang.validationError.url.empty };
      }
      try {
        new URL(trimmedUrl);
        return { isValid: true, error: null };
      } catch {
        return { isValid: false, error: lang.validationError.url.format };
      }
    }

    if (qrInputType === "text") {
      const trimmedText = textInputValue.trim();
      if (!trimmedText) {
        return { isValid: false, error: lang.validationError.text.empty };
      }
      if (trimmedText.length > 1000) {
        return { isValid: false, error: lang.validationError.text.maxLength };
      }
      return { isValid: true, error: null };
    }

    return { isValid: false, error: lang.validationError.unknownInputType };
  };
  const validateInput = (): void => {
    const { error } = getValidationResult();
    // Validate URL input
    if (qrInputType === "url") {
      setUrlError(error);
      return;
    }
    // Validate text input
    if (qrInputType === "text") {
      setTextError(error);
      return;
    }
  };

  // Generate QR code when input is valid
  const generateQRCode = (): void => {
    const { isValid, error } = getValidationResult();
    if (qrInputType === "url") {
      setUrlError(error);
      if (isValid) setQRCode(urlInputValue);
      return;
    }
    if (qrInputType === "text") {
      setTextError(error);
      if (isValid) setQRCode(textInputValue);
      return;
    }
  };

  const value = {
    qrCode,
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
    generateQRCode,
  };

  return <QRContext.Provider value={value}>{children}</QRContext.Provider>;
};
