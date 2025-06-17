import { useContext, type FC } from "react";
import { Button } from "./Button";
import CopyIcon from "../assets/icons/copy.svg";
import DownloadIcon from "../assets/icons/download.svg";
import ShareIcon from "../assets/icons/share.svg";
import { LanguageContext } from "../contexts/LanguageContext";

export const QRDisplay: FC = () => {
  const lang = useContext(LanguageContext);
  return (
    <div className="flex flex-col justify-between items-center px-2 gap-2">
      <h3 className="text-text text-3xl text-shadow-lg">
        {lang.general.qrCode}
      </h3>
      <div className="bg-red-500 rounded-lg w-64 h-64 flex items-center justify-center" />
      <Button
        label={lang.buttons.download}
        icon={DownloadIcon}
        onClick={() => {}}
        className="w-full"
      />
      <Button
        label={lang.buttons.copy}
        icon={CopyIcon}
        onClick={() => {}}
        className="w-full"
      />
      <Button
        label={lang.buttons.share}
        icon={ShareIcon}
        onClick={() => {}}
        className="w-full"
      />
    </div>
  );
};
