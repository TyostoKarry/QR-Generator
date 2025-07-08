import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { Topbar } from "./components/Topbar";

export const Layout: FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <main className="h-[calc(100dvh-4rem)]">
        <Outlet />
      </main>
    </div>
  );
};
