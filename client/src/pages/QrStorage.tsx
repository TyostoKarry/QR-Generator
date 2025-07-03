import type { FC } from "react";
import { StorageQrCodeList } from "../components/StorageQrCodeList";

export const QrStorage: FC = () => {
  return (
    <section className="flex flex-col items-center pt-24 text-center">
      <StorageQrCodeList />
    </section>
  );
};
