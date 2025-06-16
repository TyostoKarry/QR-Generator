import { useContext, type FC } from "react";
import GithubIcon from "../assets/icons/github.svg";
import { LanguageContext } from "../contexts/LanguageContext";

const GITHUB_REPO_URL = "https://github.com/TyostoKarry/QR-Generator";

export const GithubButton: FC = () => {
  const lang = useContext(LanguageContext);
  return (
    <a
      href={GITHUB_REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center "
    >
      <img src={GithubIcon} alt="GitHub Icon" className="h-6 w-6" />
      <span className="text-xs text-shadow-xs">{lang.general.github}</span>
    </a>
  );
};
