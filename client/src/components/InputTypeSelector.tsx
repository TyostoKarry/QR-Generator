import { useContext, type FC } from "react";
import { Button } from "./Button";
import ImageIcon from "../assets/icons/image.svg?react";
import LinkIcon from "../assets/icons/link.svg?react";
import PdfIcon from "../assets/icons/pdf.svg?react";
import TextIcon from "../assets/icons/text.svg?react";
import { LanguageContext } from "../contexts/LanguageContext";
import { useQRContext } from "../contexts/QRContext";

export const InputTypeSelector: FC = () => {
  const lang = useContext(LanguageContext);
  const { setQRInputType } = useQRContext();

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-text text-shadow-xs">
        {lang.general.inputTypeSelectorInfo}
      </p>
      <div className="flex flex-row gap-4">
        <Button
          label={lang.buttons.url}
          icon={<LinkIcon />}
          onClick={() => setQRInputType("url")}
          iconClassName="h-4 w-4"
        />
        <Button
          label={lang.buttons.text}
          icon={<TextIcon />}
          onClick={() => setQRInputType("text")}
        />
        <Button
          label={lang.buttons.image}
          icon={<ImageIcon />}
          onClick={() => setQRInputType("image")}
        />
        <Button
          label={lang.buttons.pdf}
          icon={<PdfIcon />}
          onClick={() => setQRInputType("pdf")}
        />
      </div>
    </div>
  );
};
