import { useContext, type FC } from "react";
import { Button } from "./Button";
import { InputTypeSelector } from "./InputTypeSelector";
import CopyIcon from "../assets/icons/copy.svg";
import DownloadIcon from "../assets/icons/download.svg";
import RefreshIcon from "../assets/icons/refresh.svg";
import ShareIcon from "../assets/icons/share.svg";
import UploadIcon from "../assets/icons/upload.svg";
import { LanguageContext } from "../contexts/LanguageContext";

export const QRGeneratorArea: FC = () => {
  const lang = useContext(LanguageContext);
  return (
    <section className="flex flex-row border-4 border-primary-1 rounded-xl px-8 py-8 gap-8">
      <div className="flex flex-col justify-between items-center text-center">
        <InputTypeSelector />
        <div className="flex flex-col items-center gap-4 w-full">
          <p className="text-text text-shadow-xs">
            {lang.general.inputDescription}
          </p>
          <input
            className="border-2 border-gray-400 rounded-lg p-2 w-full"
            placeholder={lang.general.inputPlaceholder}
          ></input>
        </div>
        <div className="flex flex-row justify-between items-center w-full">
          <Button
            label={lang.buttons.generate}
            icon={RefreshIcon}
            onClick={() => {}}
            className="px-6 py-3 text-xl rounded-full shadow-xl"
          />
          <Button
            label={lang.buttons.addLogo}
            icon={UploadIcon}
            onClick={() => {}}
          />
        </div>
      </div>
      <div className="w-0.5 rounded-md bg-primary-1" />
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
    </section>
  );
};
