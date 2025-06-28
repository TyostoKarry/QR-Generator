import { useContext, type FC } from "react";
import { QRGeneratorArea } from "../components/QRGeneratorArea";
import { LanguageContext } from "../contexts/LanguageContext";

export const QRGenerator: FC = () => {
  const lang = useContext(LanguageContext);
  return (
    <div className="flex flex-col items-center gap-8 px-4 pt-24">
      <section className="text-center w-2/3">
        <p className="text-2xl font-medium wrap text-text text-shadow-sm ">
          {lang.general.introText}
        </p>
      </section>
      <QRGeneratorArea />
    </div>
  );
};
