import React from "react";
import { Sun, Moon, LogOut, User } from "lucide-react";
import { Button } from "../UI/Button";
import { ThemeToggleButton } from "../UI/ThemeToggleBtn";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  user?: {
    phone: string;
    countryCode: string;
  } | null;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  onLogout,
  user,
}) => {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isProfileOpen &&
        !(event.target as Element).closest(".profile-dropdown-container")
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Gemini
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 relative">
          <ThemeToggleButton />

          {user && (
            <div className="relative profile-dropdown-container">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-1 p-2"
              >
                <User className="w-4 h-4" />
              </Button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                    {user.countryCode} {user.phone}
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
