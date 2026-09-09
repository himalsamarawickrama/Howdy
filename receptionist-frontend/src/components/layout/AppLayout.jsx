import { Outlet } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "../../hooks/useAuth";

export default function AppLayout() {
  const { usingMock } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#F6F7FA]">
      <Sidebar />
      <div className="ml-[220px] flex min-w-0 flex-1 flex-col">
        {usingMock && (
          <div className="flex items-center gap-2 border-b border-[#F4E9D8] bg-[#FFFBEB] px-8 py-2 text-xs font-semibold text-[#B45309]">
            <AlertTriangle size={14} className="shrink-0 text-[#B45309]" />
            <span>
              Running on seeded demo data — set <code className="rounded bg-[#F4E9D8] px-1 py-0.5 text-[11px]">VITE_USE_MOCK=false</code> and point <code className="rounded bg-[#F4E9D8] px-1 py-0.5 text-[11px]">VITE_API_BASE_URL</code> at your backend to go live.
            </span>
          </div>
        )}
        <Topbar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}