import { type FC, useState, useContext, useEffect, useRef } from "react";
import AccountIcon from "../assets/icons/account.svg?react";
import { LanguageContext } from "../contexts/LanguageContext";

interface AccountDropdownMenuProps {
  onNavigateToStorage: () => void;
  onDeleteAccount: () => void;
  onSignOut: () => void;
}

export const AccountDropdownMenu: FC<AccountDropdownMenuProps> = ({
  onNavigateToStorage,
  onDeleteAccount,
  onSignOut,
}) => {
  const lang = useContext(LanguageContext);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
        className="flex items-center gap-2 px-4 py-2 text-text text-shadow-xs bg-gradient-to-br from-gray-400 to-gray-500 rounded shadow-lg hover:brightness-105 active:brightness-95 cursor-pointer"
      >
        <AccountIcon className="w-5 h-5" />
        <span className="text-md">{lang.buttons.account}</span>
      </button>
      {isAccountDropdownOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-gradient-to-r from-gray-400 to-gray-500 rounded-md shadow-lg z-10 overflow-hidden">
          <button
            onClick={() => {
              onNavigateToStorage();
              setIsAccountDropdownOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-text border-b hover:bg-gray-500/70 border-stone-600 cursor-pointer"
          >
            {lang.buttons.storage}
          </button>
          <button
            onClick={() => {
              onDeleteAccount();
              setIsAccountDropdownOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-text border-b bg-red-500/60 hover:bg-red-500/90 border-stone-600 cursor-pointer"
          >
            {lang.buttons.deleteAccount}
          </button>
          <button
            onClick={() => {
              onSignOut();
              setIsAccountDropdownOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-text hover:bg-gray-500/70 cursor-pointer"
          >
            {lang.authentication.signOut}
          </button>
        </div>
      )}
    </div>
  );
};
