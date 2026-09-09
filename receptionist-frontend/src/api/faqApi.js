import axiosClient, { USE_MOCK } from "./axiosClient";
import { state, withDelay, nextId } from "../mock/seed";

export async function listFaqs() {
  if (USE_MOCK) return withDelay([...state.faqs]);
  return await axiosClient.get("/faqs");
}

export async function createFaq(payload) {
  if (USE_MOCK) {
    const row = { id: nextId(), ...payload };
    state.faqs.unshift(row);
    return withDelay(row);
  }
  return await axiosClient.post("/faqs", payload);
}

export async function updateFaq(id, payload) {
  if (USE_MOCK) {
    const idx = state.faqs.findIndex((f) => f.id === id);
    state.faqs[idx] = { ...state.faqs[idx], ...payload };
    return withDelay(state.faqs[idx]);
  }
  return await axiosClient.put(`/faqs/${id}`, payload);
}

export async function deleteFaq(id) {
  if (USE_MOCK) {
    state.faqs = state.faqs.filter((f) => f.id !== id);
    return withDelay({ id });
  }
  return await axiosClient.delete(`/faqs/${id}`);
}