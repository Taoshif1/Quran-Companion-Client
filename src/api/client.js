import axios from "axios";
import { API_BASE_URL } from "../config/app";

export const apiClient = axios.create({ baseURL: API_BASE_URL, timeout: 20_000, headers: { Accept: "application/json" } });

export function getApiMessage(error) {
  if (!navigator.onLine) return "You are offline. Download this Surah first to read it offline.";
  return error.response?.data?.error?.message || "Quran content is temporarily unavailable";
}

