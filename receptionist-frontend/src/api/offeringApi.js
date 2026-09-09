import axiosClient, { USE_MOCK } from "./axiosClient";
import { state, withDelay, nextId } from "../mock/seed";

export async function listOfferings() {
  if (USE_MOCK) return withDelay([...state.offerings]);
  return await axiosClient.get("/services");
}

export async function createOffering(payload) {
  if (USE_MOCK) {
    const row = { id: nextId(), isActive: true, ...payload };
    state.offerings.unshift(row);
    return withDelay(row);
  }
  return await axiosClient.post("/services", payload);
}

export async function updateOffering(id, payload) {
  if (USE_MOCK) {
    const idx = state.offerings.findIndex((o) => o.id === id);
    state.offerings[idx] = { ...state.offerings[idx], ...payload };
    return withDelay(state.offerings[idx]);
  }
  return await axiosClient.put(`/services/${id}`, payload);
}

export async function deleteOffering(id) {
  if (USE_MOCK) {
    state.offerings = state.offerings.filter((o) => o.id !== id);
    return withDelay({ id });
  }
  return await axiosClient.delete(`/services/${id}`);
}