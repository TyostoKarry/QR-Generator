import { useContext, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./Button";
import { GithubButton } from "./GithubButton";
import { useAuthContext } from "../contexts/AuthContext";
import { LanguageContext } from "../contexts/LanguageContext";
import { signUp, signOut } from "../services/authenticationService";
import { DeleteUserAccountFromSupabase } from "../services/storageService";

export const Topbar: FC = () => {
  const lang = useContext(LanguageContext);
  const { session } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.status === "error") {
      console.error("Sign-out error:", result.error);
      toast.error(lang.toast.authentication.signOutError);
    } else {
      toast.success(lang.toast.authentication.signOutSuccess);
    }
  };

  const handleSignUp = async () => {
    const result = await signUp();
    if (result.status === "error") {
      console.error("Sign-up error:", result.error);
      toast.error(lang.toast.authentication.signUpError);
    }
  };

  const navigateToStorage = () => {
    if (!session) {
      toast.error(lang.toast.generic.error.signInToAccessStorage);
      return;
    }
    navigate("/storage");
  };

  const handleDeleteUserAccountFromSupabase = async () => {
    const result = await DeleteUserAccountFromSupabase(session);
    if (result.status === "error") {
      toast.error(lang.toast.supabaseDeleteUserAccount[result.errorType]);
      return;
    }
    toast.success(lang.toast.supabaseDeleteUserAccount.success);
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between h-16 px-4 bg-gradient-to-tl from-primary-1 to-primary-2 text-text shadow-xl">
      <Link to="/" className="flex flex-row justify-center items-center gap-2">
        <img src="/images/logo.png" alt="Logo" className="w-10 h-10" />
        <h1 className="text-3xl font-bold text-shadow-sm">
          {lang.general.appName}
        </h1>
      </Link>
      <div className="flex flex-row justify-center items-center gap-4">
        <GithubButton />
        {!session ? (
          <Button label={lang.authentication.signUp} onClick={handleSignUp} />
        ) : (
          <>
            <Button label={lang.buttons.storage} onClick={navigateToStorage} />
            <Button
              label="Delete Account"
              onClick={handleDeleteUserAccountFromSupabase}
              variant="danger"
            />
            <Button
              label={lang.authentication.signOut}
              onClick={handleSignOut}
            />
          </>
        )}
      </div>
    </nav>
  );
};
