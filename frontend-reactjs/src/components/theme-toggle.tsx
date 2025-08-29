'use client';

import { useTheme } from '@/hooks/use-theme';
import { Switch } from '@/components/ui/switch';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Switch
      checked={theme === 'dark'}
      onCheckedChange={(checked) => {
        setTheme(checked ? 'dark' : 'light');
      }}
    />
  );
}
