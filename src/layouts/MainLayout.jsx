import { Outlet } from "react-router-dom";
import { DesktopNavigation, MobileNavigation } from "../components/navigation/Navigation";
import { usePreferences } from "../providers/PreferencesProvider";

export default function MainLayout() {
  const { preferences } = usePreferences();
  return <div className="min-h-dvh">{!preferences.focusMode && <DesktopNavigation/>}<main className={preferences.focusMode ? "pb-8" : "safe-bottom"}><Outlet/></main>{!preferences.focusMode && <MobileNavigation/>}</div>;
}
