import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ORDER = ["light", "dark", "system"];

const ICONS = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export default function ThemeToggle({ className = "" }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const current = ORDER.includes(theme) ? theme : "system";
  const Icon = ICONS[mounted ? current : "system"];

  const cycle = () => {
    const index = ORDER.indexOf(current);
    setTheme(ORDER[(index + 1) % ORDER.length]);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme is ${mounted ? current : "system"}. Switch theme.`}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
    >
      <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
