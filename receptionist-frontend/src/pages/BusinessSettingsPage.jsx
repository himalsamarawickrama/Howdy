import { useEffect, useState } from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import * as businessApi from "../api/businessApi";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const TONES = ["FRIENDLY", "PROFESSIONAL", "FORMAL", "CASUAL"];
const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "AR", label: "Arabic" },
];

export default function BusinessSettingsPage() {
  const { refreshBusiness } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    timezone: "Asia/Dubai",
    address: "",
    aiEnabled: false,
    tone: "FRIENDLY",
    language: "EN",
    whatsappConnected: false,
  });
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(null);
  const [saved, setSaved] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    businessApi
      .getMyBusiness()
      .then((data) => {
        if (data) {
          setForm({
            name: data.name || "",
            phone: data.phone || "",
            timezone: data.timezone || "Asia/Dubai",
            address: data.address || "",
            aiEnabled: Boolean(data.aiEnabled),
            tone: data.tone || "FRIENDLY",
            language: data.language || "EN",
            whatsappConnected: Boolean(
              data.whatsappConnected ||
                data.whatsappAccessToken ||
                data.whatsappPhoneNumberId
            ),
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load business profile:", err);
        setError("Unable to load business details from server.");
      })
      .finally(() => setLoading(false));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function saveProfile(e) {
    e.preventDefault();
    setSavingSection("profile");
    setError(null);
    try {
      await businessApi.updateMyBusiness({
        name: form.name,
        phone: form.phone,
        address: form.address,
        timezone: form.timezone,
      });
      if (typeof refreshBusiness === "function") {
        await refreshBusiness();
      }
      setSaved("profile");
      setTimeout(() => setSaved(null), 3500);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Failed to save profile. Please check server logs.");
    } finally {
      setSavingSection(null);
    }
  }

  async function saveAi() {
    setSavingSection("ai");
    setError(null);
    try {
      await businessApi.updateAiSettings({
        aiEnabled: form.aiEnabled,
        tone: form.tone,
        language: form.language,
      });
      if (typeof refreshBusiness === "function") {
        await refreshBusiness();
      }
      setSaved("ai");
      setTimeout(() => setSaved(null), 3500);
    } catch (err) {
      console.error("Failed to update AI settings:", err);
      setError("Failed to save AI settings. Please check server logs.");
    } finally {
      setSavingSection(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#F6F7FA] p-6 text-xs font-semibold text-[#7A7E8F] font-sans md:p-8">
        Loading business profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F6F7FA] p-6 text-[#1E2028] font-sans md:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4C3575]">
          <Sparkles size={14} /> Preferences
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#1E2028]">
          Business & AI settings
        </h1>
        <p className="mt-1.5 text-xs text-[#7A7E8F]">
          Control what customers see and how Howdy talks to them — no prompt-writing required.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-[#F7C6DA] bg-[#FDF1F7] p-3 text-xs font-semibold text-[#B91C5C]">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-5 max-w-3xl">
        {/* Business Profile */}
        <Card className="rounded-2xl border border-[#ECEFF3] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <h2 className="text-base font-bold text-[#1E2028]">Business profile</h2>
          <p className="mt-1 mb-5 text-xs text-[#7A7E8F]">
            Shown to customers and used by the AI to answer location/contact questions.
          </p>

          {saved === "profile" && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#F4EDFA] px-3.5 py-2.5 text-xs font-bold text-[#4C3575]">
              <CheckCircle2 size={15} /> Profile saved successfully.
            </div>
          )}

          <form onSubmit={saveProfile} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="bizName" className="text-xs font-bold text-[#1E2028]">
                Business name
              </label>
              <input
                id="bizName"
                value={form.name || ""}
                onChange={(e) => update("name", e.target.value)}
                className="w-full rounded-xl border border-[#ECEFF3] bg-[#F9FAFC] px-3.5 py-2 text-xs text-[#1E2028] outline-none focus:border-[#4C3575]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-xs font-bold text-[#1E2028]">
                  Phone
                </label>
                <input
                  id="phone"
                  value={form.phone || ""}
                  onChange={(e) => update("phone", e.target.value)}
                  className="w-full rounded-xl border border-[#ECEFF3] bg-[#F9FAFC] px-3.5 py-2 text-xs text-[#1E2028] outline-none focus:border-[#4C3575]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="timezone" className="text-xs font-bold text-[#1E2028]">
                  Timezone
                </label>
                <input
                  id="timezone"
                  value={form.timezone || ""}
                  onChange={(e) => update("timezone", e.target.value)}
                  className="w-full rounded-xl border border-[#ECEFF3] bg-[#F9FAFC] px-3.5 py-2 text-xs text-[#1E2028] outline-none focus:border-[#4C3575]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="address" className="text-xs font-bold text-[#1E2028]">
                Address
              </label>
              <input
                id="address"
                value={form.address || ""}
                onChange={(e) => update("address", e.target.value)}
                className="w-full rounded-xl border border-[#ECEFF3] bg-[#F9FAFC] px-3.5 py-2 text-xs text-[#1E2028] outline-none focus:border-[#4C3575]"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                loading={savingSection === "profile"}
                className="rounded-xl bg-[#4C3575] hover:bg-[#3D2A5E] border-transparent text-white"
              >
                Save profile
              </Button>
            </div>
          </form>
        </Card>

        {/* AI Receptionist */}
        <Card className="rounded-2xl border border-[#ECEFF3] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <h2 className="text-base font-bold text-[#1E2028]">AI receptionist</h2>
          <p className="mt-1 mb-5 text-xs text-[#7A7E8F]">
            Simple controls — no need to touch a prompt.
          </p>

          {saved === "ai" && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#F4EDFA] px-3.5 py-2.5 text-xs font-bold text-[#4C3575]">
              <CheckCircle2 size={15} /> AI settings saved successfully.
            </div>
          )}

          <div className="space-y-5">
            <label
              htmlFor="aiEnabled"
              className="flex cursor-pointer items-center gap-3 select-none"
            >
              <input
                id="aiEnabled"
                type="checkbox"
                checked={Boolean(form.aiEnabled)}
                onChange={(e) => update("aiEnabled", e.target.checked)}
                className="h-4 w-4 rounded border-[#ECEFF3] accent-[#4C3575] cursor-pointer"
              />
              <span className="text-xs font-semibold text-[#1E2028]">
                AI automatically replies to new WhatsApp messages
              </span>
            </label>

            {/* Tone of Voice */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#1E2028]">Tone of voice</span>
              <div className="inline-flex w-fit flex-wrap gap-1 rounded-xl border border-[#ECEFF3] bg-[#F9FAFC] p-1">
                {TONES.map((t) => {
                  const isActive = form.tone === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update("tone", t)}
                      className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors ${
                        isActive
                          ? "bg-[#4C3575] text-white"
                          : "text-[#7A7E8F] hover:text-[#1E2028]"
                      }`}
                    >
                      {t.charAt(0) + t.slice(1).toLowerCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reply Language */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#1E2028]">Reply language</span>
              <div className="inline-flex w-fit gap-1 rounded-xl border border-[#ECEFF3] bg-[#F9FAFC] p-1">
                {LANGUAGES.map((l) => {
                  const isActive = form.language === l.code;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => update("language", l.code)}
                      className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors ${
                        isActive
                          ? "bg-[#4C3575] text-white"
                          : "text-[#7A7E8F] hover:text-[#1E2028]"
                      }`}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>
              <span className="text-[11px] text-[#7A7E8F]">
                Howdy will also reply in whatever language the customer writes in.
              </span>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                onClick={saveAi}
                loading={savingSection === "ai"}
                className="rounded-xl bg-[#4C3575] hover:bg-[#3D2A5E] border-transparent text-white"
              >
                Save AI settings
              </Button>
            </div>
          </div>
        </Card>

        {/* WhatsApp Connection */}
        <Card className="rounded-2xl border border-[#ECEFF3] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <h2 className="text-base font-bold text-[#1E2028]">WhatsApp connection</h2>
          <p className="mt-1 mb-5 text-xs text-[#7A7E8F]">
            {form.whatsappConnected
              ? "Your WhatsApp Business number is connected and receiving messages."
              : "Connect your WhatsApp Business number to start receiving messages."}
          </p>

          <Button
            variant={form.whatsappConnected ? "ghost" : "primary"}
            className={
              form.whatsappConnected
                ? "border border-[#ECEFF3] bg-white text-[#1E2028] hover:bg-[#F9FAFC]"
                : "rounded-xl bg-[#4C3575] hover:bg-[#3D2A5E] border-transparent text-white"
            }
          >
            {form.whatsappConnected ? "Manage connection" : "Connect WhatsApp"}
          </Button>
        </Card>
      </div>
    </div>
  );
}