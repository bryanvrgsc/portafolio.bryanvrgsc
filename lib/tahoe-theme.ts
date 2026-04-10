export type Appearance = 'light' | 'dark';

export const TAHOE_APPEARANCE_QUERY = '(prefers-color-scheme: dark)';

export function resolveTahoeAppearance(prefersDark: boolean): Appearance {
  return prefersDark ? 'dark' : 'light';
}
