import { type FC, type ReactNode } from "react";

interface ButtonProps {
  label?: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  iconClassName?: string;
}

export const Button: FC<ButtonProps> = ({
  label,
  icon,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
  iconClassName = "",
}) => {
  const variantStyles = {
    primary: "bg-gradient-to-br from-button-1 to to-button-2",
    secondary: "bg-stone-400",
    danger: "bg-red-500 hover:bg-red-600 active:bg-red-500",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      type="button"
      className={`flex flex-row justify-center items-center px-4 py-2 text-text text-shadow-xs rounded shadow-lg
        ${variantStyles[variant]}
        ${icon ? "gap-2" : ""}
        ${
          disabled
            ? "opacity-70 cursor-not-allowed"
            : "hover:cursor-pointer hover:brightness-105 active:brightness-95"
        } ${className}`}
    >
      {icon && (
        <span
          className={`flex items-center ${iconClassName ? iconClassName : "h-5 w-5"}`}
        >
          {icon}
        </span>
      )}
      {label}
    </button>
  );
};
