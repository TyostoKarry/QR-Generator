import type { FC } from "react";

export const QrStorage: FC = () => {
  return (
    <section className="flex flex-col items-center pt-24 text-center">
      <p className="text-2xl font-medium wrap text-text text-shadow-sm">
        This is the QR Storage page. Here you can manage your stored QR codes.
      </p>
    </section>
  );
};
