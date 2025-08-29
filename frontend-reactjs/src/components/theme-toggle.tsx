'use client';

import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative cursor-pointer h-9 w-9 p-0 hover:bg-muted border border-border/50 hover:border-primary/30 transition-all duration-300"
      aria-label={`Alterar para tema ${isDark ? 'claro' : 'escuro'}`}
    >
      <div className="relative flex items-center justify-center">
        <Sun
          className={`h-4 w-4 transition-all duration-300 ${
            isDark
              ? 'scale-0 opacity-0 rotate-90'
              : 'scale-100 opacity-100 rotate-0'
          } text-yellow-500`}
        />
        <Moon
          className={`absolute h-4 w-4 transition-all duration-300 ${
            isDark
              ? 'scale-100 opacity-100 rotate-0'
              : 'scale-0 opacity-0 -rotate-90'
          } text-blue-500`}
        />
      </div>
    </Button>
  );
}
