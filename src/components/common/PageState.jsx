import { AlertCircle, LoaderCircle, WifiOff } from "lucide-react";

export function LoadingState({ label = "Loading Quran content…" }) {
  return <div className="flex min-h-52 items-center justify-center gap-3 text-base-content/60" role="status"><LoaderCircle className="animate-spin" />{label}</div>;
}

export function EmptyState({ title, message, offline = false }) {
  const Icon = offline ? WifiOff : AlertCircle;
  return <section className="rounded-3xl border border-base-300 bg-base-100 p-8 text-center"><Icon className="mx-auto mb-3 text-primary"/><h2 className="text-xl font-semibold">{title}</h2><p className="mt-2 text-base-content/65">{message}</p></section>;
}

