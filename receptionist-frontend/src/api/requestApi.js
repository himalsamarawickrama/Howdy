import axiosClient, { USE_MOCK } from "./axiosClient";
import { state, withDelay } from "../mock/seed";

export async function listRequests() {
  if (USE_MOCK) {
    return withDelay(
      [...state.requests].map((r) => ({
        ...r,
        customer: state.customers.find((c) => c.id === r.customerId),
        offering: state.offerings.find((o) => o.id === r.offeringId),
      }))
    );
  }
  return await axiosClient.get("/booking-requests");
}

export async function updateRequestStatus(id, status) {
  if (USE_MOCK) {
    const row = state.requests.find((r) => r.id === id);
    if (row) row.status = status;
    return withDelay(row);
  }
  return await axiosClient.put(`/booking-requests/${id}`, { status });
}