import { QRCodeCanvas } from "qrcode.react";
import { useCallback, useContext, useEffect, useState, type FC } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "./Button";
import { LanguageContext } from "../contexts/LanguageContext";
import { useQRContext } from "../contexts/QRContext";

interface QRColorPickerModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  qrCodePublicUrl?: string;
  qrCodeLogoSrc: string | null;
  qrForegroundColor: string;
  setQrForegroundColor: (color: string) => void;
  qrBackgroundColor: string;
  setQrBackgroundColor: (color: string) => void;
}

export const QRColorPickerModal: FC<QRColorPickerModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  qrCodePublicUrl,
  qrCodeLogoSrc,
  qrForegroundColor,
  setQrForegroundColor,
  qrBackgroundColor,
  setQrBackgroundColor,
}) => {
  const lang = useContext(LanguageContext);
  const { qrCode } = useQRContext();

  const [modalQrForegroundColor, setModalQrForegroundColor] =
    useState(qrForegroundColor);
  const [modalQrBackgroundColor, setModalQrBackgroundColor] =
    useState(qrBackgroundColor);

  const validateHex = (hex: string) => /^#([0-9A-Fa-f]{3}){1,2}$/.test(hex);

  let debounceTimeoutForeground: ReturnType<typeof setTimeout>;
  let debounceTimeoutBackground: ReturnType<typeof setTimeout>;

  const handleSaveColors = useCallback(() => {
    if (!validateHex(modalQrForegroundColor)) {
      setModalQrForegroundColor("#000000");
      setQrForegroundColor("#000000");
    } else {
      setQrForegroundColor(modalQrForegroundColor);
    }
    if (!validateHex(modalQrBackgroundColor)) {
      setModalQrBackgroundColor("#ffffff");
      setQrBackgroundColor("#ffffff");
    } else {
      setQrBackgroundColor(modalQrBackgroundColor);
    }
    setIsModalOpen(false);
  }, [
    modalQrForegroundColor,
    modalQrBackgroundColor,
    setQrForegroundColor,
    setQrBackgroundColor,
    setIsModalOpen,
  ]);

  useEffect(() => {
    if (!isModalOpen) return;
    setModalQrForegroundColor(qrForegroundColor);
    setModalQrBackgroundColor(qrBackgroundColor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        event.preventDefault();
        setIsModalOpen(false);
      }
      if (event.key === "Enter" && isModalOpen) {
        event.preventDefault();
        handleSaveColors();
      }
    };
    if (isModalOpen) window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, setIsModalOpen, handleSaveColors]);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="flex flex-col items-center justify-center bg-gradient-to-tl from-background-2 to-background-1 border border-gray-500 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold pb-2">
          {lang.colorPickerModal.title}
        </h2>
        <QRCodeCanvas
          id="qrcode-color-picker-canvas"
          value={
            qrCodePublicUrl
              ? qrCodePublicUrl
              : qrCode
                ? qrCode
                : lang.general.helloWorld
          }
          size={256}
          level={qrCodeLogoSrc ? "H" : "M"}
          fgColor={modalQrForegroundColor}
          bgColor={modalQrBackgroundColor}
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
        <div className="flex flex-row pt-6">
          <div className="flex flex-col items-center justify-center">
            <label className="text-s pb-2">
              {lang.colorPickerModal.foregroundColor}
            </label>
            <HexColorPicker
              color={modalQrForegroundColor}
              onChange={(value) => {
                clearTimeout(debounceTimeoutForeground);
                debounceTimeoutForeground = setTimeout(() => {
                  setModalQrForegroundColor(value);
                }, 2);
              }}
              className="w-1/2"
            />
            <input
              type="text"
              value={modalQrForegroundColor}
              onChange={(e) => setModalQrForegroundColor(e.target.value)}
              onBlur={() => {
                if (!validateHex(modalQrForegroundColor)) {
                  setModalQrForegroundColor("#000000");
                }
              }}
              className="mt-2 p-1 border  rounded w-1/2 text-center bg-white"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-s pb-2">
              {lang.colorPickerModal.backgroundColor}
            </label>
            <HexColorPicker
              color={modalQrBackgroundColor}
              onChange={(value) => {
                clearTimeout(debounceTimeoutBackground);
                debounceTimeoutBackground = setTimeout(() => {
                  setModalQrBackgroundColor(value);
                }, 2);
              }}
              className="w-1/2"
            />
            <input
              type="text"
              value={modalQrBackgroundColor}
              onChange={(e) => setModalQrBackgroundColor(e.target.value)}
              onBlur={() => {
                if (!validateHex(modalQrBackgroundColor)) {
                  setModalQrBackgroundColor("#ffffff");
                }
              }}
              className="mt-2 p-1 border  rounded w-1/2 text-center bg-white"
            />
          </div>
        </div>
        <div className="flex flex-row justify-between w-full pt-4 px-2">
          <Button
            label={lang.buttons.cancel}
            onClick={() => setIsModalOpen(false)}
            variant="secondary"
            className="w-24"
          />
          <div className="flex flex-row gap-2">
            <Button
              label={lang.buttons.reset}
              onClick={() => {
                setModalQrForegroundColor("#000000");
                setModalQrBackgroundColor("#ffffff");
              }}
              disabled={
                modalQrForegroundColor === "#000000" &&
                modalQrBackgroundColor === "#ffffff"
              }
              variant="secondary"
              className="w-24"
            />
            <Button
              label={lang.buttons.save}
              onClick={() => handleSaveColors()}
              disabled={
                !validateHex(modalQrForegroundColor) ||
                !validateHex(modalQrBackgroundColor)
              }
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
