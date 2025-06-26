import { useContext, useEffect } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import ErrorIcon from "../assets/icons/error.svg";
import UploadIcon from "../assets/icons/upload.svg";
import { LanguageContext } from "../contexts/LanguageContext";

interface DropzoneProps {
  accept: { [key: string]: string[] };
  onDrop: (acceptedFiles: File[]) => void;
  text: string;
  onDropRejected: (fileRejections: FileRejection[]) => void;
  errorText: string | null;
  setErrorText: (error: string | null) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  accept,
  onDrop,
  text,
  onDropRejected,
  errorText,
  setErrorText,
}) => {
  const lang = useContext(LanguageContext);

  const { getRootProps, getInputProps, isDragActive, isDragReject, isFocused } =
    useDropzone({
      accept,
      onDrop,
      multiple: false,
      maxSize: 10 * 1024 * 1024, // 10 MB
      onDropRejected,
    });

  useEffect(() => {
    if (isFocused) {
      setErrorText(null);
    }
  }, [isFocused, setErrorText]);

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col justify-center items-center border-2 border-dashed hover:border-gray-400 hover:bg-gray-200 h-40 p-4 rounded-md w-full max-w-110 text-center cursor-pointer
        ${isDragActive ? "border-gray-400 bg-gray-200" : isDragReject || errorText ? "border-red-300 bg-red-100" : "border-gray-300 bg-gray-100"}`}
    >
      <input {...getInputProps()} />
      <img
        src={isDragReject || errorText ? ErrorIcon : UploadIcon}
        alt="Upload Icon"
        className="h-10 w-10"
      />
      <p
        className={isDragReject || errorText ? "text-red-600" : "text-gray-700"}
      >
        {lang.inputArea.dropzone.text}
      </p>
      <p
        className={`text-sm ${isDragReject || errorText ? "text-red-400" : "text-gray-500"}`}
      >
        {isDragReject || errorText ? errorText : text}
      </p>
    </div>
  );
};
