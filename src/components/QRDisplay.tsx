import { QRCodeCanvas } from "qrcode.react";
import { useContext, type FC } from "react";
import { AddLogo } from "./AddLogo";
import { Button } from "./Button";
import CopyIcon from "../assets/icons/copy.svg?react";
import DownloadIcon from "../assets/icons/download.svg?react";
import { LanguageContext } from "../contexts/LanguageContext";
import { useQRContext } from "../contexts/QRContext";

export const QRDisplay: FC = () => {
  const lang = useContext(LanguageContext);
  const { qrCode, qrCodeLogoSrc, copyQrCodeToClipboard, downloadQrCode } =
    useQRContext();
  return (
    <div className="flex flex-col justify-between items-center px-2 gap-2">
      <h3 className="text-text text-3xl text-shadow-lg">
        {lang.general.qrCode}
      </h3>
      <QRCodeCanvas
        id="qrcode-canvas"
        value={qrCode ? qrCode : lang.general.helloWorld}
        size={256}
        level={qrCodeLogoSrc ? "H" : "M"}
        fgColor={qrCode ? "#000000" : "#bbbbbb"}
        imageSettings={
          qrCodeLogoSrc
            ? {
                src: qrCodeLogoSrc,
                height: 85,
                width: 85,
                excavate: true,
              }
            : undefined
        }
      />
      <AddLogo />
      <Button
        label={lang.buttons.copy}
        icon={<CopyIcon />}
        onClick={() => copyQrCodeToClipboard()}
        disabled={!qrCode}
        className="w-full"
      />
      <Button
        label={lang.buttons.download}
        icon={<DownloadIcon />}
        onClick={() => downloadQrCode()}
        disabled={!qrCode}
        className="w-full"
        iconClassName="h-5 w-5"
      />
    </div>
  );
};
