import { useState } from "react";
import Button from "../ui/Button";

const SENDER_STYLE = {
  CUSTOMER: { align: "flex-start", bg: "var(--surface-sunk)", color: "var(--ink)" },
  AI: { align: "flex-end", bg: "var(--accent-soft)", color: "var(--accent)" },
  BUSINESS_OWNER: { align: "flex-end", bg: "var(--ink)", color: "var(--surface)" },
};

function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function MessageThread({ conversation, onToggleHandover, onSendMessage }) {
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  if (!conversation) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--ink-faint)" }}>
        Select a conversation
      </div>
    );
  }

  const needsHuman = conversation.status === "NEEDS_HUMAN";

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;

    try {
      setSending(true);
      if (onSendMessage) {
        await onSendMessage(conversation.id, text.trim());
      }
      setText("");
    } catch (err) {
      console.error("Failed to dispatch human message:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>{conversation.customer?.name || conversation.customer?.whatsappNumber}</div>
          <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{conversation.customer?.whatsappNumber}</div>
        </div>
        <Button
          size="sm"
          variant={needsHuman ? "primary" : "ghost"}
          onClick={() => setShowToggleConfirm(true)}
        >
          {needsHuman ? "Hand back to AI" : "Take over from AI"}
        </Button>
      </div>

      {/* Messages Feed */}
      <div style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
        {(conversation.messages || []).map((m) => {
          const style = SENDER_STYLE[m.sender] || SENDER_STYLE.CUSTOMER;
          return (
            <div key={m.id || Math.random()} style={{ display: "flex", flexDirection: "column", alignItems: style.align }}>
              <div
                style={{
                  background: style.bg,
                  color: style.color,
                  padding: "9px 13px",
                  borderRadius: 10,
                  maxWidth: "72%",
                  fontSize: 13.5,
                  wordBreak: "break-word",
                }}
              >
                {m.content}
              </div>
              <span style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 3 }}>{formatTime(m.createdAt)}</span>
            </div>
          );
        })}
      </div>

      {/* Handover Prompt Confirmation */}
      {showToggleConfirm && (
        <div style={{ padding: 14, borderTop: "1px solid var(--line)", background: "var(--surface-sunk)" }}>
          <p style={{ fontSize: 13, marginBottom: 10 }}>
            {needsHuman
              ? "Hand this conversation back to the AI? It will resume automatic replies."
              : "Take over this conversation? The AI will stop replying until you hand it back."}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                onToggleHandover(conversation.id, needsHuman ? "AI_ACTIVE" : "NEEDS_HUMAN");
                setShowToggleConfirm(false);
              }}
            >
              Confirm
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowToggleConfirm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Message Composer */}
      <form
        onSubmit={handleSend}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 18px",
          borderTop: "1px solid var(--line)",
          background: "var(--surface)",
        }}
      >
        <input
          type="text"
          value={text}
          disabled={!needsHuman || sending}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            needsHuman
              ? "Type your message to send via WhatsApp..."
              : "Take over from AI to type a manual reply"
          }
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid var(--line)",
            outline: "none",
            fontSize: 13.5,
            background: needsHuman ? "var(--surface)" : "var(--surface-sunk)",
            cursor: needsHuman ? "text" : "not-allowed",
          }}
        />
        <Button
          size="sm"
          variant="primary"
          type="submit"
          disabled={!needsHuman || !text.trim() || sending}
        >
          {sending ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}