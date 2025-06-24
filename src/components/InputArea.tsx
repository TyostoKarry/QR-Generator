import { useContext, type FC } from "react";
import { Dropzone } from "./Dropzone";
import { ImagePreview } from "./ImagePreview";
import { PdfPreview } from "./PdfPreview";
import { LanguageContext } from "../contexts/LanguageContext";
import { useQRContext } from "../contexts/QRContext";
import { validateFileName } from "../utils/validateFileName";

export const InputArea: FC = () => {
  const lang = useContext(LanguageContext);
  const {
    qrInputType,
    imageFile,
    setImageFile,
    pdfFile,
    setPdfFile,
    urlInputValue,
    setUrlInputValue,
    textInputValue,
    setTextInputValue,
    imageError,
    setImageError,
    pdfError,
    setPdfError,
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
    case "image":
      return (
        <div className="flex flex-col items-center w-full py-6">
          <p className="text-text text-shadow-xs pb-2">
            {imageFile
              ? lang.inputArea[qrInputType].imageReady
              : lang.inputArea[qrInputType].inputDescription}
          </p>
          {imageFile ? (
            <ImagePreview />
          ) : (
            <Dropzone
              key={qrInputType}
              accept={{
                "image/png": [".png"],
                "image/jpeg": [".jpeg", ".jpg"],
                "image/gif": [".gif"],
              }}
              onDrop={(acceptedFiles) => {
                if (acceptedFiles.length != 1) return;
                if (!validateFileName(acceptedFiles[0].name))
                  return setImageError(
                    lang.validationError.image.invalidFileName,
                  );
                setImageFile(
                  Object.assign(acceptedFiles[0], {
                    preview: URL.createObjectURL(acceptedFiles[0]),
                  }),
                );
                setImageError(null);
              }}
              text={lang.inputArea[qrInputType].inputPlaceholder}
              onDropRejected={(fileRejections) => {
                const errorCode = fileRejections[0].errors[0].code;
                if (errorCode === "file-invalid-type") {
                  setImageError(lang.validationError.image.invalidType);
                } else if (errorCode === "too-many-files") {
                  setImageError(lang.validationError.image.tooManyFiles);
                } else if (errorCode === "file-too-large") {
                  setImageError(lang.validationError.image.tooLarge);
                }
              }}
              errorText={imageError}
              setErrorText={setImageError}
            />
          )}
        </div>
      );
    case "pdf":
      return (
        <div className="flex flex-col items-center w-full py-6">
          <p className="text-text text-shadow-xs pb-2">
            {pdfFile
              ? lang.inputArea[qrInputType].pdfReady
              : lang.inputArea[qrInputType].inputDescription}
          </p>
          {pdfFile ? (
            <PdfPreview />
          ) : (
            <Dropzone
              key={qrInputType}
              accept={{
                "application/pdf": [".pdf"],
              }}
              onDrop={(acceptedFiles) => {
                if (acceptedFiles.length != 1) return;
                if (!validateFileName(acceptedFiles[0].name))
                  return setPdfError(
                    lang.validationError.image.invalidFileName,
                  );
                setPdfFile(
                  Object.assign(acceptedFiles[0], {
                    preview: URL.createObjectURL(acceptedFiles[0]),
                  }),
                );
                setImageError(null);
              }}
              text={lang.inputArea[qrInputType].inputPlaceholder}
              onDropRejected={(fileRejections) => {
                const errorCode = fileRejections[0].errors[0].code;
                if (errorCode === "file-invalid-type") {
                  setPdfError(lang.validationError.pdf.invalidType);
                } else if (errorCode === "too-many-files") {
                  setPdfError(lang.validationError.pdf.tooManyFiles);
                } else if (errorCode === "file-too-large") {
                  setPdfError(lang.validationError.pdf.tooLarge);
                }
              }}
              errorText={pdfError}
              setErrorText={setPdfError}
            />
          )}
        </div>
      );
    case "text":
      return (
        <div className="flex flex-col items-center w-full py-6">
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
    case "url":
      return (
        <div className="flex flex-col items-center w-full py-6">
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
  }
};
