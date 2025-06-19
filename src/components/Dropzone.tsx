import { useContext } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import ErrorIcon from "../assets/icons/error.svg";
import UploadIcon from "../assets/icons/upload.svg";
import { LanguageContext } from "../contexts/LanguageContext";

interface DropzoneProps {
  accept: { [key: string]: string[] };
  onDrop: (acceptedFiles: File[]) => void;
  text: string;
  onDropRejected: (fileRejections: FileRejection[]) => void;
  errorText?: string | null;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  accept,
  onDrop,
  text,
  onDropRejected,
  errorText,
}) => {
  const lang = useContext(LanguageContext);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept,
      onDrop,
      multiple: false,
      maxSize: 10485760, // 10 MB
      onDropRejected,
    });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col justify-center items-center border-2 border-dashed hover:border-gray-400 hover:bg-gray-200 h-40 p-4 rounded-md w-full text-center cursor-pointer
        ${isDragActive ? "border-gray-400 bg-gray-200" : isDragReject ? "border-red-300 bg-red-100" : "border-gray-300 bg-gray-100"}`}
    >
      <input {...getInputProps()} />
      <img
        src={isDragReject ? ErrorIcon : UploadIcon}
        alt="Upload Icon"
        className="h-10 w-10"
      />
      <p className={isDragReject ? "text-red-600" : "text-gray-700"}>
        {lang.inputArea.dropzone.text}
      </p>
      <p
        className={`text-sm ${isDragReject ? "text-red-400" : "text-gray-500"}`}
      >
        {isDragReject && errorText ? errorText : text}
      </p>
    </div>
  );
};
