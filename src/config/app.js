import branding from "../../app.config.json";

export const APP_NAME = branding.name;
export const APP_DESCRIPTION = branding.description;
export const APP_VERSION = branding.version;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
