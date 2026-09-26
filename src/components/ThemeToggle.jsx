import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-md transition-colors text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
      title="Toggle Theme"
    >
      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
