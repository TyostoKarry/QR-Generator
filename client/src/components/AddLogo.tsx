import { useContext, type FC } from "react";
import { toast } from "sonner";
import { Button } from "./Button";
import RemoveIcon from "../assets/icons/remove.svg?react";
import UploadIcon from "../assets/icons/upload.svg?react";
import { LanguageContext } from "../contexts/LanguageContext";

interface AddLogoProps {
  qrCodeId?: string;
  qrCodeLogoSrc: string;
  setQrCodeLogoSrc: (src: string) => void;
}

export const AddLogo: FC<AddLogoProps> = ({
  qrCodeId,
  qrCodeLogoSrc,
  setQrCodeLogoSrc,
}) => {
  const lang = useContext(LanguageContext);
  const id = qrCodeId ? `logo-upload-${qrCodeId}` : "logo-upload";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return toast.error(lang.toast.generic.error.logoNoFileSelected);
    if (file.size > 100 * 1024 * 1024)
      return toast.error(lang.toast.generic.error.logoFileTooLarge);
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type))
      return toast.error(lang.toast.generic.error.logoInvalidFileType);

    const previewUrl = URL.createObjectURL(file);
    setQrCodeLogoSrc(previewUrl);
  };

  return (
    <>
      {qrCodeLogoSrc ? (
        <Button
          label={lang.buttons.removeLogo}
          icon={<RemoveIcon />}
          onClick={() => {
            URL.revokeObjectURL(qrCodeLogoSrc);
            setQrCodeLogoSrc("");
          }}
          variant="danger"
          className="w-full"
          iconClassName="h-4 w-4"
        />
      ) : (
        <Button
          label={lang.buttons.addLogo}
          icon={<UploadIcon />}
          onClick={() => document.getElementById(id)?.click()}
          className="w-full"
        />
      )}
      <input
        id={id}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        onChange={(e) => handleFileChange(e)}
      />
    </>
  );
};
