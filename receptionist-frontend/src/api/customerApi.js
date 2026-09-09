import axiosClient, { USE_MOCK } from "./axiosClient";
import { state, withDelay } from "../mock/seed";

export async function listCustomers() {
  if (USE_MOCK) return withDelay([...state.customers]);
  // Removed the { } around data because axiosClient already unwraps it!
  const data = await axiosClient.get("/customers");
  return data;
}

export async function getCustomer(id) {
  if (USE_MOCK) return withDelay(state.customers.find((c) => c.id === id) ?? null);
  // Removed the { } around data here too
  const data = await axiosClient.get(`/customers/${id}`);
  return data;
}