import axiosClient, { USE_MOCK } from "./axiosClient";
import { state, withDelay } from "../mock/seed";

export async function listConversations() {
  if (USE_MOCK) {
    return withDelay(
      [...state.conversations]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .map((c) => ({ ...c, customer: state.customers.find((cu) => cu.id === c.customerId) }))
    );
  }
  const res = await axiosClient.get("/conversations");
  return Array.isArray(res) ? res : (res?.data ?? []);
}

export async function getConversationMessages(id) {
  if (USE_MOCK) {
    const convo = state.conversations.find((c) => c.id === id);
    return withDelay(convo ? [...convo.messages] : []);
  }
  const res = await axiosClient.get(`/conversations/${id}/messages`);
  return Array.isArray(res) ? res : (res?.data ?? []);
}

export async function setConversationStatus(id, status) {
  if (USE_MOCK) {
    const convo = state.conversations.find((c) => c.id === id);
    if (convo) convo.status = status;
    return withDelay(convo);
  }
  const res = await axiosClient.put(`/conversations/${id}/status`, { status });
  return res?.data ?? res;
}

export async function sendMessage(id, content) {
  if (USE_MOCK) {
    const convo = state.conversations.find((c) => c.id === id);
    if (convo) {
      const newMsg = {
        id: Date.now(),
        sender: "BUSINESS_OWNER",
        content,
        createdAt: new Date().toISOString(),
      };
      convo.messages.push(newMsg);
      convo.updatedAt = newMsg.createdAt;
      return withDelay(newMsg);
    }
    return withDelay(null);
  }
  const res = await axiosClient.post(`/conversations/${id}/messages`, { content });
  return res?.data ?? res;
}