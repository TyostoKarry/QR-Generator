import { useContext, type FC } from "react";
import { Button } from "./Button";
import { InputArea } from "./InputArea";
import { InputTypeSelector } from "./InputTypeSelector";
import RefreshIcon from "../assets/icons/refresh.svg?react";
import { LanguageContext } from "../contexts/LanguageContext";
import { useQRContext } from "../contexts/QRContext";

export const QRInputPanel: FC = () => {
  const lang = useContext(LanguageContext);
  const { generateQRCode } = useQRContext();

  return (
    <section className="flex flex-col justify-between items-center text-center">
      <InputTypeSelector />
      <InputArea />
      <div className="flex justify-start w-full">
        <Button
          label={lang.buttons.generate}
          icon={<RefreshIcon />}
          onClick={() => generateQRCode()}
          className="px-6 py-3 text-xl rounded-full shadow-xl"
          iconClassName="h-6.5 w-6.5"
        />
      </div>
    </section>
  );
};
