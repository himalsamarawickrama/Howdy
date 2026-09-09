import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { business, logout } = useAuth();
  const navigate = useNavigate();

  // Determine connection status based on the presence of the Phone Number ID
  const isConnected = Boolean(business?.whatsappPhoneNumberId || business?.whatsappAccessToken);

  return (
    <header className="flex h-[58px] items-center justify-between border-b border-[#ECEFF3] bg-white px-7 font-sans">
      <div className="text-sm font-semibold text-[#1E2028]">
        {business?.name || "Your business"}
      </div>

      <div className="flex items-center gap-3.5">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
            isConnected ? "text-[#4F7A5B]" : "text-[#A8402F]"
          }`}
        >
          <span
            aria-hidden
            className={`h-1.5 w-1.5 rounded-full ${
              isConnected ? "bg-[#4F7A5B]" : "bg-[#A8402F]"
            }`}
          />
          {isConnected ? "WhatsApp connected" : "WhatsApp not connected"}
        </span>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="cursor-pointer rounded-lg border border-transparent bg-transparent px-2.5 py-1.5 text-[12.5px] font-semibold text-[#7A7E8F] transition-colors hover:bg-[#FAFBFD] hover:text-[#1E2028]"
        >
          Log out
        </button>
      </div>
    </header>
  );
}