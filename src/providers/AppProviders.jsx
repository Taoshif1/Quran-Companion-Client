import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { PreferencesProvider } from "./PreferencesProvider";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 300_000, retry: 1 } } });

export function AppProviders({ children }) {
  return <QueryClientProvider client={queryClient}><PreferencesProvider>{children}</PreferencesProvider><Toaster position="top-center" /></QueryClientProvider>;
}

