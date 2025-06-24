import { QRCodeCanvas } from "qrcode.react";
import { useContext, useState, type FC } from "react";
import { AddLogo } from "./AddLogo";
import { Button } from "./Button";
import { QRColorPickerModal } from "./QRColorPickerModal";
import CopyIcon from "../assets/icons/copy.svg?react";
import DownloadIcon from "../assets/icons/download.svg?react";
import PaletteIcon from "../assets/icons/palette.svg?react";
import { LanguageContext } from "../contexts/LanguageContext";
import { useQRContext } from "../contexts/QRContext";

export const QRDisplay: FC = () => {
  const lang = useContext(LanguageContext);
  const { qrCode, copyQrCodeToClipboard, downloadQrCode } = useQRContext();

  const [qrCodeLogoSrc, setQrCodeLogoSrc] = useState<string | null>("");
  const [qrForegroundColor, setQrForegroundColor] = useState<string>("#000000");
  const [qrBackgroundColor, setQrBackgroundColor] = useState<string>("#ffffff");

  const [isColorPickerModalOpen, setIsColorPickerModalOpen] =
    useState<boolean>(false);

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
        fgColor={qrCode ? qrForegroundColor : "#bbbbbb"}
        bgColor={qrCode ? qrBackgroundColor : "#ffffff"}
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
      <div className="w-full flex flex-row gap-2">
        <AddLogo
          qrCodeLogoSrc={qrCodeLogoSrc}
          setQrCodeLogoSrc={setQrCodeLogoSrc}
        />
        <Button
          icon={<PaletteIcon />}
          onClick={() => setIsColorPickerModalOpen(true)}
          iconClassName="h-6 w-6"
          disabled={!qrCode}
        />
      </div>
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
      <QRColorPickerModal
        isModalOpen={isColorPickerModalOpen}
        setIsModalOpen={setIsColorPickerModalOpen}
        qrCodeLogoSrc={qrCodeLogoSrc}
        qrForegroundColor={qrForegroundColor}
        setQrForegroundColor={setQrForegroundColor}
        qrBackgroundColor={qrBackgroundColor}
        setQrBackgroundColor={setQrBackgroundColor}
      />
    </div>
  );
};
