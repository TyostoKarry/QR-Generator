import { useContext, type FC } from "react";
import { GithubButton } from "./GithubButton";
import { LanguageContext } from "../contexts/LanguageContext";

export const Topbar: FC = () => {
  const lang = useContext(LanguageContext);
  return (
    <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-tl from-primary-1 to-primary-2 text-text shadow-xl">
      <h1 className="text-3xl font-bold text-shadow-sm">
        {lang.general.appName}
      </h1>
      <GithubButton />
    </div>
  );
};
