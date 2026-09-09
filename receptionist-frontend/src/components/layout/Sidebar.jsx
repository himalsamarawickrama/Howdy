import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Scissors,
  CalendarCheck,
  HelpCircle,
  Settings,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/conversations", label: "Conversations", icon: MessageSquare },
  { to: "/dashboard/customers", label: "Customers", icon: Users },
  { to: "/dashboard/offerings", label: "Services", icon: Scissors },
  { to: "/dashboard/requests", label: "Bookings", icon: CalendarCheck },
  { to: "/dashboard/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col justify-between border-r border-[#ECEFF3] bg-white p-5 font-sans">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-3 pb-6 pt-1.5">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#4C3575] text-sm font-extrabold text-white">
            H
          </div>
          <div>
            <div className="font-display text-base font-extrabold tracking-tight text-[#1E2028]">
              Howdy
            </div>
            <div className="text-[10.5px] font-medium text-[#8E93A6]">
              Salon Reception
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-colors duration-150 ${
                    isActive
                      ? "bg-[#4C3575] text-white"
                      : "text-[#7A7E8F] hover:bg-[#FAFBFD] hover:text-[#1E2028]"
                  }`
                }
              >
                <Icon size={17} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Upgrade & Logout */}
      <div className="flex flex-col gap-2.5">
        <div className="rounded-2xl bg-[#16171B] p-4 text-center text-white">
          <div className="mx-auto mb-2 grid h-7 w-7 place-items-center rounded-full bg-white/10">
            <Sparkles size={14} className="text-[#E3C4F8]" />
          </div>
          <div className="text-[11.5px] font-bold">Updating your</div>
          <div className="mb-2.5 text-[10.5px] text-white/60">
            plan for Premium!
          </div>
          <button className="w-full cursor-pointer rounded-lg bg-[#4C3575] py-1.5 text-[11px] font-bold text-white transition hover:bg-[#3D2A5E]">
            Upgrade Now
          </button>
        </div>

        <button
          onClick={logout}
          className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[12.5px] font-semibold text-[#7A7E8F] transition-colors hover:text-[#1E2028]"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}