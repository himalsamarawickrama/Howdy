import axiosClient, { USE_MOCK } from "./axiosClient";
import { state, withDelay } from "../mock/seed";

export async function getMyBusiness() {
  if (USE_MOCK) return withDelay({ ...state.business });
  return await axiosClient.get("/business/me");
}

export async function updateMyBusiness(patch) {
  if (USE_MOCK) {
    Object.assign(state.business, patch);
    return withDelay({ ...state.business });
  }
  return await axiosClient.put("/business/me", patch);
}

export async function updateAiSettings(patch) {
  if (USE_MOCK) {
    Object.assign(state.business, patch);
    return withDelay({ ...state.business });
  }
  return await axiosClient.put("/business/me/ai-settings", patch);
}

export async function getDashboardSummary() {
  if (USE_MOCK) {
    const pendingRequests = state.requests.filter((r) => r.status === "PENDING").length;
    const needsHuman = state.conversations.filter((c) => c.status === "NEEDS_HUMAN").length;
    return withDelay({
      todaysConversations: state.conversations.length,
      newCustomers: state.customers.filter((c) => c.leadStatus === "NEW").length,
      aiResponses: state.conversations.reduce(
        (sum, c) => sum + c.messages.filter((m) => m.sender === "AI").length,
        0
      ),
      humanHandovers: needsHuman,
      leads: state.customers.length,
      pendingRequests,
      popularOffering: state.offerings[1]?.name ?? "—",
    });
  }
  return await axiosClient.get("/business/dashboard-summary");
}