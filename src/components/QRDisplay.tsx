import { QRCodeCanvas } from "qrcode.react";
import { useContext, type FC } from "react";
import { Button } from "./Button";
import CopyIcon from "../assets/icons/copy.svg";
import DownloadIcon from "../assets/icons/download.svg";
import UploadIcon from "../assets/icons/upload.svg";
import { LanguageContext } from "../contexts/LanguageContext";
import { useQRContext } from "../contexts/QRContext";

export const QRDisplay: FC = () => {
  const lang = useContext(LanguageContext);
  const { qrCode, copyQrCodeToClipboard, downloadQrCode } = useQRContext();
  return (
    <div className="flex flex-col justify-between items-center px-2 gap-2">
      <h3 className="text-text text-3xl text-shadow-lg">
        {lang.general.qrCode}
      </h3>
      <QRCodeCanvas
        id="qrcode-canvas"
        value={qrCode ? qrCode : lang.general.helloWorld}
        size={256}
        level="L"
        fgColor={qrCode ? "#000000" : "#bbbbbb"}
      />
      <Button
        label={lang.buttons.addLogo}
        icon={UploadIcon}
        onClick={() => {}}
        className="w-full"
      />
      <Button
        label={lang.buttons.copy}
        icon={CopyIcon}
        onClick={() => copyQrCodeToClipboard()}
        disabled={!qrCode}
        className="w-full"
      />
      <Button
        label={lang.buttons.download}
        icon={DownloadIcon}
        onClick={() => downloadQrCode()}
        disabled={!qrCode}
        className="w-full"
      />
    </div>
  );
};
