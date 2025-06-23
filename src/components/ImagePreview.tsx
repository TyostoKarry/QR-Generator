import type { FC } from "react";
import RemoveIcon from "../assets/icons/remove.svg";
import { useQRContext } from "../contexts/QRContext";

export const ImagePreview: FC = () => {
  const { imageFile, setImageFile } = useQRContext();
  if (!imageFile) {
    return null; // Return null if no image file is selected
  }

  return (
    <div className="flex flex-col justify-between h-40">
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-center relative h-32">
          <img
            src={imageFile.preview}
            alt="image file"
            className="h-32 cursor-pointer"
            onClick={() => window.open(imageFile.preview, "_blank")}
          />
          <img
            src={RemoveIcon}
            alt="Remove Icon"
            aria-label="Remove image"
            className="absolute top-1 right-1 h-6 w-6 bg-red-400 rounded-full p-1 cursor-pointer hover:bg-red-500"
            onClick={() => {
              URL.revokeObjectURL(imageFile.preview);
              setImageFile(null);
            }}
          />
        </div>
      </div>
      <p className="text-text text-shadow-xs">{imageFile.name}</p>
    </div>
  );
};
