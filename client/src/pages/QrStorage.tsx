import type { FC } from "react";
import { StorageQrCodeList } from "../components/StorageQrCodeList";

export const QrStorage: FC = () => {
  return (
    <section className="flex flex-col items-center h-full text-center">
      <StorageQrCodeList />
    </section>
  );
};
