import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Scissors,
  AlertCircle,
} from "lucide-react";

import * as businessApi from "../api/businessApi";
import * as conversationApi from "../api/conversationApi";
import { useAuth } from "../hooks/useAuth";

function formatTime(date) {
  if (!date) return "";
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "";
  return value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getCustomerName(conversation) {
  return (
    conversation?.customer?.name ||
    conversation?.customer?.whatsappNumber ||
    "Unknown customer"
  );
}

function getLastMessage(conversation) {
  if (!conversation?.messages?.length) return "No messages yet";
  const last = conversation.messages[conversation.messages.length - 1];
  return last?.content || "No message content";
}

function todayLabel() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const { user, business } = useAuth();

  const [summary, setSummary] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const [summaryData, convData] = await Promise.all([
          businessApi.getDashboardSummary(),
          conversationApi.listConversations(),
        ]);

        if (!mounted) return;
        setSummary(summaryData);
        setConversations(Array.isArray(convData) ? convData.slice(0, 5) : []);
      } catch (err) {
        console.error("Dashboard loading failed:", err);
        if (!mounted) return;
        setError("Unable to load dashboard data. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  const businessName = business?.name || user?.name || "your business";

  const todaySchedule = summary?.todaySchedule || [];
  const stylistColumns = summary?.staffMembers || [];
  const revenueTrend = summary?.revenueTrend || [];
  const revenueBars = summary?.revenueByPeriod || [];
  const topStylists = summary?.topStylists || [];

  return (
    <div className="min-h-screen w-full bg-[#F6F7FA] p-6 text-[#1E2028] font-sans md:p-8">
      {/* Top Filter & Search Bar */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3.5">
        <div className="flex flex-wrap items-center gap-2.5">
          {[business?.address || "All Locations", "All Staff", todayLabel()].map((tag) => (
            <button
              key={tag}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#ECEFF3] bg-white px-3.5 py-2 text-xs font-semibold text-[#1E2028] transition hover:bg-slate-50"
            >
              {tag} <ChevronDown size={13} className="text-[#7A7E8F]" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-3 text-[#7A7E8F]" />
            <input
              type="text"
              placeholder="Search"
              className="w-44 rounded-xl border border-[#ECEFF3] bg-white py-2 pl-8.5 pr-3 text-xs outline-none focus:border-[#4C3575]"
            />
          </div>

          <div className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-[#ECEFF3] bg-white transition hover:bg-slate-50">
            <Bell size={16} className="text-[#7A7E8F]" />
          </div>

          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#E4D5F7] text-xs font-extrabold text-[#4C3575]">
            {businessName.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {error && (
        <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-[#F7C6DA] bg-[#FDF1F7] p-3 text-xs font-semibold text-[#B91C5C]">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-[#ECEFF3] bg-white p-12 text-center text-xs font-semibold text-[#7A7E8F]">
          Loading your dashboard...
        </div>
      ) : (
        <>
          {/* Top 3 KPI Cards */}
          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "New Customers",
                value: summary?.newCustomers ?? 0,
                icon: Users,
              },
              {
                title: "Conversations Today",
                value: summary?.todaysConversations ?? 0,
                icon: Calendar,
              },
              {
                title: "AI Replies Sent",
                value: summary?.aiResponses ?? 0,
                icon: Scissors,
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="flex items-center gap-3.5 rounded-2xl border border-[#ECEFF3] bg-white p-5 shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#4C3575] text-white">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold text-[#7A7E8F]">
                      {card.title}
                    </div>
                    <div className="text-2xl font-extrabold text-[#1E2028]">
                      {card.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Main 3-Column Grid */}
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.25fr_1fr_0.95fr]">
            {/* Column 1: Day Schedule */}
            <div className="rounded-2xl border border-[#ECEFF3] bg-white p-5 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1E2028]">Day Schedule</h3>
                <MoreHorizontal size={16} className="cursor-pointer text-[#7A7E8F]" />
              </div>

              {todaySchedule.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#A4A8B8]">
                  No appointments scheduled for today yet.
                </div>
              ) : (
                <>
                  <div
                    className="mb-3 grid text-center text-[11px] font-semibold text-[#7A7E8F]"
                    style={{
                      gridTemplateColumns: `40px repeat(${Math.max(stylistColumns.length, 1)}, 1fr)`,
                    }}
                  >
                    <div />
                    {(stylistColumns.length ? stylistColumns : [{ name: "Team" }]).map((s) => (
                      <div key={s.name}>• {s.name}</div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {todaySchedule.map((row, idx) => (
                      <div
                        key={idx}
                        className="grid min-h-[46px] items-center border-t border-dashed border-[#F1F3F7] pt-1.5"
                        style={{
                          gridTemplateColumns: `40px repeat(${Math.max(stylistColumns.length, 1)}, 1fr)`,
                        }}
                      >
                        <span className="text-[10px] font-semibold text-[#A4A8B8]">
                          {row.time}
                        </span>
                        {row.slots?.map((slot, i) => (
                          <div
                            key={i}
                            className="rounded-xl p-2 text-[9px] font-bold leading-tight"
                            style={{
                              gridColumn: (slot.col ?? i) + 1,
                              backgroundColor: slot.bg || "#F4EDFA",
                              color: slot.color || "#4C3575",
                            }}
                          >
                            <div>{slot.title}</div>
                            <div className="font-medium opacity-85">{slot.client}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Column 2: Analytics & Trends */}
            <div className="flex flex-col gap-4">
              {/* Wave Chart Card */}
              <div className="rounded-2xl border border-[#ECEFF3] bg-white p-4.5 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                <div className="mb-3.5 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <button className="rounded-lg bg-[#4C3575] px-3 py-1 text-[11px] font-bold text-white">
                      Conversations
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#7A7E8F]">
                    Trend <ChevronDown size={12} />
                  </div>
                </div>

                {revenueTrend.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#A4A8B8]">
                    Not enough data yet to show a trend.
                  </div>
                ) : (
                  <div className="relative h-28 w-full">
                    <svg viewBox="0 0 300 100" className="h-full w-full overflow-visible">
                      <polyline
                        fill="none"
                        stroke="#4C3575"
                        strokeWidth="2.2"
                        points={revenueTrend
                          .map((p, i) => `${(i / (revenueTrend.length - 1 || 1)) * 300},${100 - p.value}`)
                          .join(" ")}
                      />
                    </svg>
                    <div className="mt-1.5 flex justify-between text-[9px] text-[#A4A8B8]">
                      {revenueTrend.map((p) => (
                        <span key={p.label}>{p.label}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bar Revenue Card */}
              <div className="rounded-2xl border border-[#ECEFF3] bg-white p-4.5 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                <div className="mb-3.5 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#1E2028]">Requests by Period</h4>
                  <span className="flex items-center gap-1 text-[11px] text-[#7A7E8F]">
                    Monthly <ChevronDown size={12} />
                  </span>
                </div>

                {revenueBars.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#A4A8B8]">
                    No request data yet.
                  </div>
                ) : (
                  <div className="flex h-24 items-end justify-between pb-1">
                    {revenueBars.map((bar, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className="w-2 rounded-sm bg-[#4C3575]"
                          style={{ height: `${Math.max(bar.value, 4)}px` }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Recent Conversations & Stylists */}
            <div className="flex flex-col gap-4">
              {/* Conversations */}
              <div className="rounded-2xl border border-[#ECEFF3] bg-white p-4.5 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                <div className="mb-3.5 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#1E2028]">Recent Conversations</h4>
                  <Link to="/dashboard/conversations" className="text-[#4C3575]">
                    <ChevronRight size={16} />
                  </Link>
                </div>

                {conversations.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#A4A8B8]">
                    No conversations yet. Once WhatsApp is connected, they'll show up here.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {conversations.map((conversation) => (
                      <Link
                        key={conversation.id}
                        to={`/dashboard/conversations/${conversation.id}`}
                        className="flex items-center justify-between text-inherit no-underline transition hover:opacity-85"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F1F3F7] text-xs font-bold text-[#7A7E8F]">
                            {getCustomerName(conversation).charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-xs font-bold text-[#1E2028]">
                              {getCustomerName(conversation)}
                            </div>
                            <div className="max-w-[150px] truncate text-[10px] text-[#7A7E8F]">
                              {getLastMessage(conversation)}
                            </div>
                          </div>
                        </div>
                        <span className="shrink-0 text-[10px] font-bold text-[#A4A8B8]">
                          {formatTime(conversation.updatedAt || conversation.createdAt)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Stylists */}
              <div className="rounded-2xl border border-[#ECEFF3] bg-white p-4.5 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                <div className="mb-3.5 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#1E2028]">Top Stylists</h4>
                  <MoreHorizontal size={16} className="cursor-pointer text-[#7A7E8F]" />
                </div>

                {topStylists.length === 0 ? (
                  <div className="py-3.5 text-center text-xs text-[#A4A8B8]">
                    No staff data yet.
                  </div>
                ) : (
                  <div className="flex justify-around">
                    {topStylists.map((stylist, idx) => (
                      <div key={idx} className="text-center">
                        <div className="mx-auto mb-1.5 grid h-10 w-10 place-items-center rounded-full bg-[#F1F3F7] text-xs font-bold text-[#7A7E8F]">
                          {stylist.rating}
                        </div>
                        <div className="text-xs font-bold text-[#1E2028]">
                          {stylist.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}