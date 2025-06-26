import { useContext, type FC } from "react";
import { Button } from "./Button";
import { GithubButton } from "./GithubButton";
import { useAuthContext } from "../contexts/AuthContext";
import { LanguageContext } from "../contexts/LanguageContext";
import { signUp, signOut } from "../services/authenticationService";

export const Topbar: FC = () => {
  const lang = useContext(LanguageContext);
  const { session } = useAuthContext();

  return (
    <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-tl from-primary-1 to-primary-2 text-text shadow-xl">
      <div className="flex flex-row justify-center items-center gap-2">
        <img src="images/logo.png" alt="Logo" className="w-10 h-10" />
        <h1 className="text-3xl font-bold text-shadow-sm">
          {lang.general.appName}
        </h1>
      </div>
      <div className="flex flex-row justify-center items-center gap-4">
        <GithubButton />
        {!session ? (
          <Button label={lang.authentication.signUp} onClick={signUp} />
        ) : (
          <Button label={lang.authentication.signOut} onClick={signOut} />
        )}
      </div>
    </div>
  );
};
