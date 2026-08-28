import { Laptop, Moon, Sun, SunMedium } from "lucide-react";
import { usePreferences } from "../../providers/PreferencesProvider";

const themes = [
  { value: "system", label: "System", icon: Laptop },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "reading", label: "Reading", icon: SunMedium },
];

export function ThemeControl() {
  const { preferences, setPreferences } = usePreferences();
  const currentIndex = themes.findIndex((theme) => theme.value === preferences.theme);
  const current = themes[currentIndex] || themes[0];
  const Icon = current.icon;
  const cycle = () => setPreferences((value) => ({ ...value, theme: themes[(currentIndex + 1) % themes.length].value }));
  return <button className="btn btn-circle btn-ghost" onClick={cycle} aria-label={`Theme: ${current.label}. Activate to change`} title={`Theme: ${current.label}`}><Icon size={19}/></button>;
}

