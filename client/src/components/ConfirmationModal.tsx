import { type FC, useContext, useEffect } from "react";
import { LanguageContext } from "../contexts/LanguageContext";

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  const lang = useContext(LanguageContext);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-6 rounded-lg shadow-lg w-120">
        <h2 className="text-center text-text text-lg text-shadow-sm font-semibold">
          {message}
        </h2>
        <div className="flex justify-end gap-4 pt-8">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gradient-to-br from-gray-400 to-gray-500 text-text rounded shadow hover:brightness-105 active:brightness-95"
          >
            {lang.buttons.cancel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-gradient-to-br from-red-500 to-red-600 text-text rounded shadow hover:brightness-105 active:brightness-95"
          >
            {lang.buttons.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};
