import { useContext, type FC } from "react";
import { LanguageContext } from "../contexts/LanguageContext";
import { useQRContext } from "../contexts/QRContext";

export const InputArea: FC = () => {
  const lang = useContext(LanguageContext);
  const {
    qrInputType,
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
  } = useQRContext();

  const handleShiftAndEnterKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      generateQRCode();
    }
  };

  switch (qrInputType) {
    case "url":
      return (
        <div className="flex flex-col items-center w-full">
          <p
            className={`text-text text-shadow-xs ${urlError ? "pb-2" : "pb-6"}`}
          >
            {lang.inputArea[qrInputType].inputDescription}
          </p>
          {urlError && (
            <p className="flex items-start w-full text-red-500 text-xs pl-2">
              {urlError}
            </p>
          )}
          <input
            className={`border-2 rounded-lg p-2 w-full ${urlError ? "border-red-500" : "border-gray-400"}`}
            placeholder={lang.inputArea[qrInputType].inputPlaceholder}
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            onBlur={() => validateInput()}
            onFocus={() => setUrlError(null)}
            onKeyDown={(e) => {
              handleShiftAndEnterKeyDown(e);
            }}
          />
        </div>
      );
    case "text":
      return (
        <div className="flex flex-col items-center w-full">
          <p
            className={`text-text text-shadow-xs ${textError ? "pb-2" : "pb-6"}`}
          >
            {lang.inputArea[qrInputType].inputDescription}
          </p>
          {textError && (
            <p className="flex items-start w-full text-red-500 text-xs pl-2">
              {textError}
            </p>
          )}
          <textarea
            rows={5}
            className={`border-2 rounded-lg p-2 w-full ${textError ? "border-red-500" : "border-gray-400"}`}
            placeholder={lang.inputArea[qrInputType].inputPlaceholder}
            value={textInputValue}
            onChange={(e) => setTextInputValue(e.target.value)}
            onBlur={() => validateInput()}
            onFocus={() => setTextError(null)}
            onKeyDown={(e) => {
              handleShiftAndEnterKeyDown(e);
            }}
          ></textarea>
        </div>
      );
    default:
      return (
        <p className="text-text text-shadow-xs">
          Selected unimplemented QR input type
        </p>
      );
  }
};
