import { useContext, type FC } from "react";
import { Button } from "./Button";
import ImageIcon from "../assets/icons/image.svg";
import LinkIcon from "../assets/icons/link.svg";
import PdfIcon from "../assets/icons/pdf.svg";
import TextIcon from "../assets/icons/text.svg";
import { LanguageContext } from "../contexts/LanguageContext";

export const InputTypeSelector: FC = () => {
  const lang = useContext(LanguageContext);
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-text text-shadow-xs">
        {lang.general.inputTypeSelectorInfo}
      </p>
      <div className="flex flex-row gap-4">
        <Button
          label={lang.buttons.url}
          icon={LinkIcon}
          onClick={() => {}}
          iconClassName="h-4 w-4"
        />
        <Button label={lang.buttons.text} icon={TextIcon} onClick={() => {}} />
        <Button
          label={lang.buttons.image}
          icon={ImageIcon}
          onClick={() => {}}
        />
        <Button label={lang.buttons.pdf} icon={PdfIcon} onClick={() => {}} />
      </div>
    </div>
  );
};
