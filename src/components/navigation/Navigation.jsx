import { Bookmark, BookOpen, Home, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { APP_NAME } from "../../config/app";

const items = [{ to: "/", label: "Home", icon: Home }, { to: "/surahs", label: "Read", icon: BookOpen }, { to: "/bookmarks", label: "Bookmarks", icon: Bookmark }, { to: "/settings", label: "Settings", icon: Settings }];

export function DesktopNavigation() {
  return <header className="hidden border-b border-base-300 bg-base-100/90 backdrop-blur md:block"><div className="page-shell flex h-18 items-center justify-between"><NavLink to="/" className="text-xl font-semibold tracking-tight text-primary">{APP_NAME}</NavLink><nav className="flex gap-2" aria-label="Primary">{items.map(({to,label}) => <NavLink key={to} to={to} className={({isActive}) => `btn btn-ghost ${isActive ? "text-primary" : ""}`}>{label}</NavLink>)}</nav></div></header>;
}

export function MobileNavigation() {
  return <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-base-300 bg-base-100/95 px-2 pt-2 backdrop-blur md:hidden" style={{paddingBottom:"env(safe-area-inset-bottom)"}} aria-label="Primary">{items.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} className={({isActive}) => `flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs ${isActive ? "bg-primary/10 text-primary" : "text-base-content/60"}`}><Icon size={20}/><span>{label}</span></NavLink>)}</nav>;
}

