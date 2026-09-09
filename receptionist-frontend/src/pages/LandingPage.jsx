import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Scissors,
  CalendarCheck,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Play,
  Pause,
  RotateCcw,
  Send,
} from "lucide-react";

export default function HowdyLanding() {
  const [activeTab, setActiveTab] = useState("video");
  const [isPlaying, setIsPlaying] = useState(true);

  const navigationLinks = useMemo(
    () => [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
    ],
    []
  );

  const launchSteps = useMemo(
    () => [
      {
        title: "1. Add your services & prices",
        detail: "Haircuts, color, treatments, spa times",
      },
      {
        title: "2. Link WhatsApp Business",
        detail: "Official Meta Cloud API integration",
      },
      {
        title: "3. Review and confirm incoming bookings",
        detail: "AI captures customer contact & preferred times",
      },
    ],
    []
  );

  const features = useMemo(
    () => [
      {
        title: "24/7 Live WhatsApp Desk",
        detail:
          "Replies in seconds to late-night and weekend client inquiries, eliminating lost bookings.",
        icon: Clock,
      },
      {
        title: "Smart Treatment Quoting",
        detail:
          "Answers inquiries on hair lengths, toning, and package prices with exact numbers.",
        icon: Scissors,
      },
      {
        title: "Automated Booking Queue",
        detail:
          "Parses freeform chats into structured appointment requests ready for your confirmation.",
        icon: CalendarCheck,
      },
      {
        title: "Multi-Lingual AI Reception",
        detail:
          "Handles English and Arabic fluently with natural, polite salon hospitality tones.",
        icon: Sparkles,
      },
      {
        title: "Zero Setup Downtime",
        detail:
          "No technical coding or telephony swaps required. Connect directly with your phone number.",
        icon: Zap,
      },
      {
        title: "Meta Cloud API Security",
        detail:
          "Enterprise encryption and official Meta compliance protect your salon customer data.",
        icon: ShieldCheck,
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[#FAF8FD] font-sans text-[#1B1626]">
      {/* CSS Keyframe Animations for Generative Demo */}
      <style>{`
        @keyframes fadeInOut {
          0%, 15% { opacity: 0; transform: translateY(8px); }
          20%, 90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-4px); }
        }
        @keyframes aiThinking {
          0%, 30% { opacity: 0; }
          35%, 45% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes customerOne {
          0% { opacity: 0; transform: translateY(10px); }
          5%, 90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; }
        }
        @keyframes aiReplyOne {
          0%, 45% { opacity: 0; transform: translateY(10px); }
          50%, 90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; }
        }
        @keyframes bookingLoggedCard {
          0%, 70% { opacity: 0; transform: scale(0.95) translateY(10px); }
          75%, 92% { opacity: 1; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: scale(0.95); }
        }
        @keyframes progressTimeline {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .anim-progress {
          animation: progressTimeline 12s linear infinite;
        }
        .anim-customer {
          animation: customerOne 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        .anim-thinking {
          animation: aiThinking 12s ease infinite;
        }
        .anim-ai {
          animation: aiReplyOne 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        .anim-booking {
          animation: bookingLoggedCard 12s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        .paused-anim {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Sticky Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#EBE4F3] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-r from-[#412C68] to-[#592D57] text-xs font-black text-white shadow-sm">
              H
            </div>
            <span className="text-lg font-black tracking-tight text-[#1B1626]">
              Howdy
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navigationLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs font-semibold text-[#766A8A] transition hover:text-[#1B1626]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-xl px-3.5 py-2 text-xs font-bold text-[#766A8A] transition hover:bg-[#F2EDF8] hover:text-[#1B1626]"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-[#412C68] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#342254]"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-12 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-[#EBE4F3] bg-white shadow-[0_20px_60px_rgba(65,44,104,0.07)]">
          <div className="grid lg:grid-cols-12">
            {/* Left Hero Content */}
            <div className="flex flex-col justify-between p-8 sm:p-12 lg:col-span-6 lg:p-14">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D9CAEC] bg-[#F4EFFB] px-3 py-1 text-[11px] font-bold text-[#412C68]">
                  <Sparkles size={13} className="text-[#412C68]" />
                  <span>AI Receptionist for Salons</span>
                </div>

                <h1 className="mt-6 text-3xl font-black tracking-tight text-[#1B1626] sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
                  Turn WhatsApp chats into confirmed salon bookings.
                </h1>

                <p className="mt-4 text-xs leading-relaxed text-[#766A8A] sm:text-sm">
                  Howdy replies instantly, quotes treatment pricing, and schedules client appointments 24/7 so your team can focus on styling chairs.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#412C68] to-[#592D57] px-6 py-3 text-xs font-bold text-white shadow-md transition hover:opacity-95"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight size={14} />
                  </Link>
                  <a
                    href="#how-it-works"
                    className="rounded-xl border border-[#EBE4F3] bg-[#FAF8FD] px-5 py-3 text-xs font-bold text-[#1B1626] transition hover:bg-[#F2EDF8]"
                  >
                    How System Works
                  </a>
                </div>
              </div>

              <div className="mt-10 border-t border-[#EBE4F3] pt-6 text-[11px] text-[#766A8A]">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#412C68]" />
                    <span>Multi-lingual AI (English & Arabic)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#412C68]" />
                    <span>Instant WhatsApp replies</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Rich Violet-Plum Showcase with Generative Video / Simulator */}
            <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-r from-[#412C68] to-[#592D57] p-8 text-white sm:p-12 lg:col-span-6 lg:p-14">
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
                    <Sparkles size={13} />
                    <span>Live Simulation</span>
                  </div>

                  {/* Mode Selector Toggle */}
                  <div className="flex items-center rounded-xl bg-black/40 p-1 border border-white/15 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setActiveTab("video")}
                      className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                        activeTab === "video"
                          ? "bg-white !text-[#412C68] font-black shadow-sm"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Play
                        size={11}
                        className={activeTab === "video" ? "text-[#412C68] fill-[#412C68]" : "text-white/80"}
                      />
                      <span>AI Demo Video</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("setup")}
                      className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                        activeTab === "setup"
                          ? "bg-white !text-[#412C68] font-black shadow-sm"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Zap
                        size={12}
                        className={activeTab === "setup" ? "text-[#412C68]" : "text-white/80"}
                      />
                      <span>3-Min Setup</span>
                    </button>
                  </div>
                </div>

                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {activeTab === "video"
                    ? "Watch Howdy take bookings in under 15 seconds."
                    : "Launch your 24/7 AI front desk in under 3 minutes."}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-white/80">
                  {activeTab === "video"
                    ? "Continuous generative demonstration: customer asks question -> AI calculates price & availability -> appointment logged to dashboard."
                    : "Connect directly to your WhatsApp Business number to reply, price services, and record appointments instantly."}
                </p>
              </div>

              {/* Dynamic Showcase View: Animated Generative Video Canvas */}
              <div className="relative z-10 my-6">
                {activeTab === "video" ? (
                  <div className="relative rounded-2xl border border-white/20 bg-[#160E24]/95 shadow-2xl backdrop-blur-md overflow-hidden">
                    {/* Video Player Style Header */}
                    <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                        <span className="text-[10.5px] font-bold tracking-wider uppercase text-white/90">
                          Automated Flow Walkthrough
                        </span>
                      </div>

                      {/* Play / Pause / Replay Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="grid h-6 w-6 place-items-center rounded-md bg-white/10 hover:bg-white/20 text-white cursor-pointer transition"
                          title={isPlaying ? "Pause Demo" : "Play Demo"}
                        >
                          {isPlaying ? <Pause size={11} /> : <Play size={11} className="fill-white" />}
                        </button>
                      </div>
                    </div>

                    {/* Generative Chat Stream Window */}
                    <div className="relative p-4 space-y-3.5 min-h-[295px] max-h-[305px] overflow-hidden text-xs">
                      {/* Step 1: Customer WhatsApp Message */}
                      <div className={`anim-customer ${!isPlaying ? "paused-anim" : ""}`}>
                        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/10 border border-white/10 p-3 text-white">
                          <span className="text-[10px] block font-bold text-cyan-300 mb-0.5">Incoming Client Message</span>
                          "Hi! Do you have a slot for Balayage & Blowdry this Thursday around 3 PM? What’s the price?"
                        </div>
                      </div>

                      {/* Step 2: Generative AI Reasoning Indicator */}
                      <div className={`anim-thinking ${!isPlaying ? "paused-anim" : ""}`}>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] text-purple-200 border border-white/10">
                          <Sparkles size={12} className="animate-spin text-amber-300" />
                          <span>AI searching salon catalog & stylist schedule...</span>
                        </div>
                      </div>

                      {/* Step 3: Instant AI Smart Response */}
                      <div className={`anim-ai ${!isPlaying ? "paused-anim" : ""}`}>
                        <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-[#592D57] border border-white/15 p-3 text-white shadow-md">
                          <span className="text-[10px] block font-bold text-emerald-300 mb-0.5">AI Instant Reply (2s)</span>
                          "Hi Sarah! ✨ Yes! We have an opening at <strong>3:00 PM</strong> with Maya. Our Balayage + Blowdry is <strong>450 AED</strong>. Can I reserve this for you?"
                        </div>
                      </div>

                      {/* Step 4: System Booking Card Logged into Admin */}
                      <div className={`anim-booking ${!isPlaying ? "paused-anim" : ""}`}>
                        <div className="rounded-xl bg-gradient-to-r from-emerald-950/80 to-purple-950/80 border border-emerald-400/50 p-3 shadow-lg">
                          <div className="flex items-center justify-between text-emerald-300 text-[11px] font-bold mb-1">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 size={13} />
                              Appointment Confirmed & Logged
                            </span>
                            <span className="text-[9.5px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-200">
                              Synced to Dashboard
                            </span>
                          </div>
                          <div className="text-[11px] text-white/95">
                            Sarah Jenkins · Balayage + Blowdry · Thursday 3:00 PM (Maya)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Generative Looping Progress Bar */}
                    <div className="w-full bg-white/10 h-1">
                      <div className={`h-full bg-gradient-to-r from-cyan-400 to-emerald-400 anim-progress ${!isPlaying ? "paused-anim" : ""}`} />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/15">
                          <Scissors size={15} className="text-white" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Quick Launch Steps</div>
                          <div className="text-[10px] text-white/70">Ready out of the box</div>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                        <Zap size={11} /> 0 Code Needed
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {launchSteps.map((step) => (
                        <div
                          key={step.title}
                          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3 transition hover:bg-white/15"
                        >
                          <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-emerald-300">
                            <CheckCircle2 size={14} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-white">{step.title}</div>
                            <div className="truncate text-[10px] text-white/70">{step.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-4 text-[11px] text-white/75">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  <span>Multi-lingual AI (English & Arabic)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  <span>Instant WhatsApp replies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How the System Works Section */}
      <section id="how-it-works" className="border-t border-[#EBE4F3] bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#412C68]">
              Automated Architecture
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1B1626] sm:text-3xl">
              How the system operates behind the scenes
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[#766A8A] sm:text-sm">
              From WhatsApp trigger to calendar confirmation, Howdy handles your reception autonomously in four automated phases.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#EBE4F3] bg-[#FAF8FD] p-6">
              <span className="text-xs font-black text-[#412C68]">PHASE 01</span>
              <h3 className="mt-3 text-base font-bold text-[#1B1626]">Client WhatsApp Inflow</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#766A8A]">
                Customer initiates chat via your official WhatsApp phone number. Meta Cloud API webhooks route message to Howdy instantly.
              </p>
            </div>

            <div className="rounded-2xl border border-[#EBE4F3] bg-[#FAF8FD] p-6">
              <span className="text-xs font-black text-[#412C68]">PHASE 02</span>
              <h3 className="mt-3 text-base font-bold text-[#1B1626]">Generative Intent Parser</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#766A8A]">
                AI reads service requests (hair cut, balayage, facial), extracts preferred times, and checks your team's real-time schedule.
              </p>
            </div>

            <div className="rounded-2xl border border-[#EBE4F3] bg-[#FAF8FD] p-6">
              <span className="text-xs font-black text-[#412C68]">PHASE 03</span>
              <h3 className="mt-3 text-base font-bold text-[#1B1626]">Dynamic Price Quoting</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#766A8A]">
                Provides exact pricing based on length, add-ons, and stylist level directly in natural conversation.
              </p>
            </div>

            <div className="rounded-2xl border border-[#EBE4F3] bg-[#FAF8FD] p-6">
              <span className="text-xs font-black text-[#412C68]">PHASE 04</span>
              <h3 className="mt-3 text-base font-bold text-[#1B1626]">Dashboard Sync</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#766A8A]">
                Creates clean booking cards on your dashboard for staff confirmation. Reminders are dispatched automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="features" className="border-t border-[#EBE4F3] bg-[#FAF8FD] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#412C68]">
              Salon Optimized
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1B1626] sm:text-3xl">
              Engineered specifically for beauty salons & spas
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[#766A8A] sm:text-sm">
              Generic chatbots fail with salon nuances. Howdy natively understands length variations, service bundles, stylist breaks, and appointment deposits.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#EBE4F3] bg-white p-6 shadow-xs transition hover:border-[#412C68]/30 hover:shadow-md"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#F4EFFB] text-[#412C68]">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-[#1B1626]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#766A8A]">
                    {item.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section id="pricing" className="px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-[#412C68] to-[#592D57] p-8 text-center text-white shadow-xl sm:p-12">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Ready to automate every client inquiry?
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-white/80 sm:text-sm">
              Connect your salon number, customize your prices, and start turning inquiries into confirmed bookings today.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link
                to="/register"
                className="rounded-xl bg-white px-6 py-3 text-xs font-bold text-[#412C68] shadow-md transition hover:bg-[#FAF8FD]"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold text-white backdrop-blur-xs transition hover:bg-white/20"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EBE4F3] bg-white px-6 py-8 text-[11px] text-[#766A8A]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span>© 2026 Howdy Receptionist Technologies</span>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Service</a>
            <Link to="/login" className="hover:underline">Owner Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}