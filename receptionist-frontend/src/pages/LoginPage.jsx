import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Sparkles,
  MessageSquare,
  Scissors,
  CheckCircle2,
} from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("owner@bloomsalon.ae");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Couldn't log in. Check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError("");
      setLoading(true);
      try {
        const userInfoRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        if (!userInfoRes.ok) {
          throw new Error("Unable to retrieve profile from Google.");
        }

        const profile = await userInfoRes.json();

        await loginWithGoogle({
          email: profile.email,
          name: profile.name,
          googleId: profile.sub,
          picture: profile.picture,
        });

        navigate("/dashboard");
      } catch (err) {
        console.error("Google login error:", err);
        setError(
          err?.response?.data?.message ||
            "Google authentication failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google login prompt was canceled or failed."),
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#ECEFF3] p-4 font-sans text-[#1E2028] sm:p-8">
      <div className="flex w-full max-w-6xl min-h-[680px] overflow-hidden rounded-[28px] border border-[#ECEFF3] bg-white shadow-[0_20px_60px_rgba(30,32,40,0.06)]">
        {/* Left Form */}
        <div className="flex flex-1 flex-col justify-between p-8 sm:p-12 lg:p-16">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#4C3575] text-sm font-black text-white">
              H
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight text-[#1E2028]">
              Howdy
            </span>
          </div>

          <div className="mx-auto w-full max-w-md py-8">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#1E2028]">
                Welcome Back
              </h1>
              <p className="mt-2 text-xs text-[#7A7E8F]">
                Enter your email and password to access your salon dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-[#F7C6DA] bg-[#FDF1F7] p-3 text-xs font-semibold text-[#B91C5C]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-bold text-[#1E2028]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@your-salon.com"
                  className="w-full rounded-xl border border-[#ECEFF3] bg-[#FAFBFD] px-3.5 py-2.5 text-xs text-[#1E2028] outline-none transition focus:border-[#4C3575] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-bold text-[#1E2028]"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-[#ECEFF3] bg-[#FAFBFD] px-3.5 py-2.5 pr-10 text-xs text-[#1E2028] outline-none transition focus:border-[#4C3575] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 cursor-pointer text-[#7A7E8F] transition hover:text-[#1E2028]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex cursor-pointer items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-[#ECEFF3] accent-[#4C3575]"
                  />
                  <span className="text-xs text-[#7A7E8F]">Remember Me</span>
                </label>
                <a
                  href="#forgot"
                  className="text-xs font-semibold text-[#4C3575] hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full rounded-xl border-transparent bg-[#4C3575] py-2.5 text-xs font-bold text-white transition hover:bg-[#3D2A5E]"
              >
                Log In
              </Button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#ECEFF3]" />
                </div>
                <span className="relative bg-white px-3 text-[11px] font-medium text-[#7A7E8F]">
                  Or Continue With
                </span>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleGoogleAuth()}
                  className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-[#ECEFF3] bg-[#FAFBFD] py-2.5 text-xs font-bold text-[#1E2028] transition hover:bg-[#F1F3F7]"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.43 7.37 24 12 24Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12c0 2.02.46 3.84 1.26 5.42l4.02-3.15Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.57 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                    />
                  </svg>
                  Continue with Google
                </button>
              </div>

              <div className="pt-2 text-center text-xs text-[#7A7E8F]">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-[#4C3575] hover:underline"
                >
                  Register Now
                </Link>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#A4A8B8]">
            <span>© 2026 Howdy Receptionist Technologies</span>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:underline">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:underline">
                Terms
              </a>
            </div>
          </div>
        </div>

        {/* Right Feature Panel */}
        <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#4C3575] via-[#402A66] to-[#271942] p-12 text-white lg:flex">
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#7A3450]/35 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#3D2A5E]/50 blur-3xl" />

          <div className="relative z-10 max-w-md">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-[#E4D5F7] backdrop-blur-xs">
              <Sparkles size={13} />
              <span>AI Receptionist for Salons</span>
            </div>
            <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-white">
              Effortlessly handle bookings and client chats 24/7.
            </h2>
            <p className="mt-2.5 text-xs leading-relaxed text-white/70">
              Your AI answers WhatsApp inquiries, calculates service quotes, and
              schedules appointments automatically while your stylists stay focused on their craft.
            </p>
          </div>

          <div className="relative z-10 my-6">
            <div className="relative rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-white/20">
                    <Scissors size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Bloom Hair & Spa</div>
                    <div className="text-[10px] text-white/60">
                      Live WhatsApp Reception
                    </div>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  AI Active
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="rounded-xl bg-white/5 p-2.5 border border-white/5">
                  <div className="text-[10px] text-white/60">New Leads</div>
                  <div className="mt-0.5 text-sm font-extrabold">24</div>
                </div>
                <div className="rounded-xl bg-white/5 p-2.5 border border-white/5">
                  <div className="text-[10px] text-white/60">Auto Replies</div>
                  <div className="mt-0.5 text-sm font-extrabold">182</div>
                </div>
                <div className="rounded-xl bg-white/5 p-2.5 border border-white/5">
                  <div className="text-[10px] text-white/60">Booked Today</div>
                  <div className="mt-0.5 text-sm font-extrabold">12</div>
                </div>
              </div>

              <div className="absolute -bottom-5 -right-3 w-64 rounded-xl border border-white/20 bg-[#1E2028]/90 p-3 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-[#4C3575] text-[10px] font-bold text-white">
                    <MessageSquare size={12} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[11px] font-bold text-white">
                      Sarah Jenkins
                    </div>
                    <div className="truncate text-[9.5px] text-emerald-400">
                      Balayage appointment confirmed ✓
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-white/60">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#E4D5F7]" />
              <span>Official WhatsApp Cloud API</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#E4D5F7]" />
              <span>Zero setup downtime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}