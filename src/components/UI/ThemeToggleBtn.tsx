// import { useTheme } from './context/ThemeContext';
import { Sun, Moon } from "lucide-react";
import { FC } from "react";
import { useTheme } from "../../context/ThemeContext";

export const ThemeToggleButton: FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      {theme === "dark" ? (
        <Moon size={20} className="text-gray-500" />
      ) : (
        <Sun size={20} className="text-yellow-400" />
      )}
    </button>
  );
};
