import { useEffect, useState } from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import * as conversationApi from "../api/conversationApi";
import ConversationList from "../components/conversations/ConversationList";
import MessageThread from "../components/conversations/MessageThread";
import Skeleton from "../components/ui/Skeleton";

export default function ConversationsPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  function load(keepSelection) {
    conversationApi.listConversations().then((rows) => {
      const data = Array.isArray(rows) ? rows : [];
      setConversations(data);
      if (!keepSelection) setSelectedId(data[0]?.id ?? null);
      setLoading(false);
    });
  }

  useEffect(() => load(false), []);

  async function handleToggleHandover(id, status) {
    await conversationApi.setConversationStatus(id, status);
    load(true);
  }

  async function handleSendMessage(conversationId, content) {
    await conversationApi.sendMessage(conversationId, content);
    load(true);
  }

  const selected = conversations.find((c) => c.id === selectedId);

  return (
    <div className="min-h-screen w-full bg-[#F6F7FA] p-6 text-[#1E2028] font-sans md:p-8">
      {/* Page Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4C3575]">
            <Sparkles size={14} /> Live Inbox
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1E2028]">
            Conversations
          </h1>
          <p className="mt-1.5 text-xs text-[#7A7E8F]">
            Every WhatsApp thread live — hand over to yourself whenever the AI shouldn't be the one replying.
          </p>
        </div>

        {/* Total Chats Pill */}
        <div className="flex items-center gap-3 rounded-xl border border-[#ECEFF3] bg-white px-4 py-2 shadow-xs">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#4C3575] text-white">
            <MessageSquare size={16} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#7A7E8F]">
              TOTAL CHATS
            </div>
            <div className="text-base font-extrabold text-[#1E2028]">
              {conversations.length}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[#ECEFF3] bg-white p-7 shadow-xs">
          <Skeleton rows={6} />
        </div>
      ) : (
        <div className="grid h-[calc(100vh-190px)] min-h-[460px] grid-cols-1 overflow-hidden rounded-2xl border border-[#ECEFF3] bg-white shadow-xs md:grid-cols-[320px_1fr]">
          {/* Conversation List Left Column */}
          <div className="h-full overflow-y-auto border-r border-[#ECEFF3] bg-[#FAFBFD]">
            <ConversationList
              conversations={conversations}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          {/* Active Message Thread Right Column */}
          <div className="flex h-full flex-col overflow-y-auto bg-white">
            <MessageThread
              conversation={selected}
              onToggleHandover={handleToggleHandover}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
}