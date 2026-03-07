import { Outlet } from "react-router-dom";
import AppSidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto w-ful">
        <Outlet />
      </main>
    </div>
  );
}
