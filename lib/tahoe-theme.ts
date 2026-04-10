export type Appearance = 'light' | 'dark';
export type ThemeMode = 'system' | 'dark' | 'light';

export const TAHOE_APPEARANCE_QUERY = '(prefers-color-scheme: dark)';
export const SYSTEM_THEME_MODE_STORAGE_KEY = 'system_theme_mode';

export function resolveTahoeAppearance(prefersDark: boolean): Appearance {
  return prefersDark ? 'dark' : 'light';
}

export function resolveAppearanceForThemeMode(themeMode: ThemeMode, prefersDark: boolean): Appearance {
  if (themeMode === 'dark') {
    return 'dark';
  }

  if (themeMode === 'light') {
    return 'light';
  }

  return resolveTahoeAppearance(prefersDark);
}

export function resolveStoredThemeMode(value: string | null): ThemeMode {
  return value === 'dark' || value === 'light' || value === 'system' ? value : 'system';
}

export function getNextThemeMode(themeMode: ThemeMode): ThemeMode {
  if (themeMode === 'system') {
    return 'dark';
  }

  if (themeMode === 'dark') {
    return 'light';
  }

  return 'system';
}
