import { Bot, UserRound, AlertCircle, CheckCircle2 } from "lucide-react";

const STATUS_CONFIG = {
  AI_ACTIVE: {
    label: "AI handling",
    bg: "#ECFDF5",
    color: "#047857",
    icon: Bot,
  },
  NEEDS_HUMAN: {
    label: "Needs you",
    bg: "#FFFBEB",
    color: "#B45309",
    icon: AlertCircle,
  },
  CLOSED: {
    label: "Closed",
    bg: "#F1F5F9",
    color: "#64748B",
    icon: CheckCircle2,
  },
};

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ConversationList({ conversations, selectedId, onSelect }) {
  if (!conversations || conversations.length === 0) {
    return (
      <div
        style={{
          padding: "40px 20px",
          textAlign: "center",
          color: "#7A7E8F",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        No conversations yet.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {conversations.map((c) => {
        const lastMessage = c.messages?.[c.messages.length - 1];
        const isSelected = c.id === selectedId;
        const status = STATUS_CONFIG[c.status] || STATUS_CONFIG.CLOSED;
        const StatusIcon = status.icon;
        const name = c.customer?.name || c.customer?.whatsappNumber || "Unknown";
        const initial = name.charAt(0).toUpperCase();

        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            style={{
              textAlign: "left",
              border: "none",
              borderBottom: "1px solid #ECEFF3",
              backgroundColor: isSelected ? "#F4EDFA" : "transparent",
              padding: "14px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              transition: "background-color 0.15s ease",
              outline: "none",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) e.currentTarget.style.backgroundColor = "#F9FAFC";
            }}
            onMouseLeave={(e) => {
              if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {/* Active Left Pill Indicator */}
            {isSelected && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 3.5,
                  backgroundColor: "#4C3575",
                  borderTopRightRadius: 3,
                  borderBottomRightRadius: 3,
                }}
              />
            )}

            {/* Customer Avatar */}
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                backgroundColor: isSelected ? "#4C3575" : "#E4D5F7",
                color: isSelected ? "#FFFFFF" : "#4C3575",
                display: "grid",
                placeItems: "center",
                fontSize: 13,
                fontWeight: 800,
                flexShrink: 0,
                transition: "all 0.15s ease",
              }}
            >
              {initial}
            </div>

            {/* Chat Details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#1E2028",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {name}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#A4A8B8",
                    flexShrink: 0,
                  }}
                >
                  {formatTime(lastMessage?.createdAt || c.updatedAt)}
                </span>
              </div>

              {/* Status Badge */}
              <div style={{ marginBottom: 6 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "2px 7px",
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 700,
                    backgroundColor: status.bg,
                    color: status.color,
                  }}
                >
                  <StatusIcon size={11} />
                  {status.label}
                </span>
              </div>

              {/* Last Message Preview */}
              <div
                style={{
                  color: "#7A7E8F",
                  fontSize: 11.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  lineHeight: 1.4,
                }}
              >
                {lastMessage?.sender === "AI" && (
                  <span style={{ fontWeight: 700, color: "#4C3575" }}>AI: </span>
                )}
                {lastMessage?.sender === "BUSINESS_OWNER" && (
                  <span style={{ fontWeight: 700, color: "#1E2028" }}>You: </span>
                )}
                {lastMessage?.content || "No message content"}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}