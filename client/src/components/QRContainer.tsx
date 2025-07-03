import type { FC, ReactNode } from "react";

interface QRContainerProps {
  leftElement: ReactNode;
  rightElement: ReactNode;
}

export const QRContainer: FC<QRContainerProps> = ({
  leftElement,
  rightElement,
}) => {
  return (
    <div className="flex flex-row border-4 bg-white border-primary-1 rounded-xl px-8 py-8 gap-8">
      {leftElement}
      <div className="w-0.5 rounded-md bg-primary-1" />
      {rightElement}
    </div>
  );
};
