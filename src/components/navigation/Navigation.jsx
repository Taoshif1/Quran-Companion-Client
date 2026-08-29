import { Bookmark, BookOpen, Home, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { APP_NAME } from "../../config/app";
const items = [{ to: "/", label: "Home", icon: Home }, { to: "/surahs", label: "Read", icon: BookOpen }, { to: "/bookmarks", label: "Bookmarks", icon: Bookmark }, { to: "/settings", label: "Settings", icon: Settings }];
export function DesktopNavigation() { return <header className="desktop-nav"><div className="page-shell"><NavLink to="/" className="wordmark">{APP_NAME}</NavLink><nav aria-label="Primary">{items.map(({to,label}) => <NavLink key={to} to={to} className={({isActive}) => isActive ? "active" : ""}>{label}</NavLink>)}</nav></div></header>; }
export function MobileNavigation() { return <nav className="mobile-nav" style={{paddingBottom:"env(safe-area-inset-bottom)"}} aria-label="Primary">{items.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} className={({isActive}) => isActive ? "active" : ""}><Icon/><span>{label}</span></NavLink>)}</nav>; }
