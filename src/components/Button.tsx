import { type FC } from "react";

interface ButtonProps {
  label: string;
  icon?: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
}

export const Button: FC<ButtonProps> = ({
  label,
  icon,
  onClick,
  disabled = false,
  className = "",
  iconClassName = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      type="button"
      className={`flex flex-row justify-center items-center px-4 py-2 bg-gradient-to-br from-button-1 to to-button-2 text-text text-shadow-xs rounded shadow-lg
        ${icon ? "gap-2" : ""}
        ${
          disabled
            ? "opacity-70 cursor-not-allowed"
            : "hover:cursor-pointer hover:brightness-105 active:brightness-95"
        } ${className}`}
    >
      {icon && (
        <img
          src={icon}
          alt="Button Icon"
          className={iconClassName ? iconClassName : `h-5 w-5`}
        />
      )}
      {label}
    </button>
  );
};
