import { Outlet } from "react-router-dom";
import { DesktopNavigation, MobileNavigation } from "../components/navigation/Navigation";

export default function MainLayout() {
  return <div className="min-h-dvh"><DesktopNavigation/><main className="safe-bottom"><Outlet/></main><MobileNavigation/></div>;
}

