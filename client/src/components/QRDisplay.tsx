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

interface QRDisplayProps {
  qrCodeId?: string;
  qrCodePublicUrl?: string;
}

export const QRDisplay: FC<QRDisplayProps> = ({
  qrCodeId,
  qrCodePublicUrl,
}) => {
  const lang = useContext(LanguageContext);
  const { qrCode, copyQrCodeToClipboard, downloadQrCode } = useQRContext();

  const [qrCodeLogoSrc, setQrCodeLogoSrc] = useState<string>("");
  const [qrForegroundColor, setQrForegroundColor] = useState<string>("#000000");
  const [qrBackgroundColor, setQrBackgroundColor] = useState<string>("#ffffff");

  const [isColorPickerModalOpen, setIsColorPickerModalOpen] =
    useState<boolean>(false);

  return (
    <section className="flex flex-col justify-between items-center px-2 gap-2">
      <h3 className="text-text text-3xl text-shadow-lg">
        {lang.general.qrCode}
      </h3>
      <QRCodeCanvas
        id={qrCodeId ? `qrcode-canvas-${qrCodeId}` : "qrcode-canvas"}
        value={
          qrCodePublicUrl
            ? qrCodePublicUrl
            : qrCode
              ? qrCode
              : lang.general.helloWorld
        }
        size={256}
        level={qrCodeLogoSrc ? "H" : "M"}
        fgColor={qrCode || qrCodePublicUrl ? qrForegroundColor : "#bbbbbb"}
        bgColor={qrCode || qrCodePublicUrl ? qrBackgroundColor : "#ffffff"}
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
          qrCodeId={qrCodeId}
          qrCodeLogoSrc={qrCodeLogoSrc}
          setQrCodeLogoSrc={setQrCodeLogoSrc}
        />
        <Button
          icon={<PaletteIcon />}
          onClick={() => setIsColorPickerModalOpen(true)}
          iconClassName="h-6 w-6"
          disabled={!qrCode && !qrCodePublicUrl}
        />
      </div>
      <Button
        label={lang.buttons.copy}
        icon={<CopyIcon />}
        onClick={() => copyQrCodeToClipboard(qrCodeId)}
        disabled={!qrCode && !qrCodePublicUrl}
        className="w-full"
      />
      <Button
        label={lang.buttons.download}
        icon={<DownloadIcon />}
        onClick={() => downloadQrCode(qrCodeId)}
        disabled={!qrCode && !qrCodePublicUrl}
        className="w-full"
        iconClassName="h-5 w-5"
      />
      <QRColorPickerModal
        isModalOpen={isColorPickerModalOpen}
        setIsModalOpen={setIsColorPickerModalOpen}
        qrCodePublicUrl={qrCodePublicUrl}
        qrCodeLogoSrc={qrCodeLogoSrc}
        qrForegroundColor={qrForegroundColor}
        setQrForegroundColor={setQrForegroundColor}
        qrBackgroundColor={qrBackgroundColor}
        setQrBackgroundColor={setQrBackgroundColor}
      />
    </section>
  );
};
