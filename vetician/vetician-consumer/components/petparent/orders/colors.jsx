export const COLORS2 = {
  primary: '#558B2F',
  secondary: '#7CB342',
  bg: '#FAFAFA',
  card: '#FFFFFF',
  text: '#2D3A1F',
  subtext: '#6B7B5E',
  border: '#E8F0E1',
  accent: '#F1F8E9',
  shadow: '#C5D9A8',
};

export const STATUS_COLORS = {
  Active: {
    bg: COLORS2.accent,
    text: COLORS2.primary,
    accent: COLORS2.primary,
  },
  Completed: {
    bg: COLORS2.accent,
    text: COLORS2.secondary,
    accent: COLORS2.secondary,
  },
  Cancelled: {
    bg: COLORS2.accent,
    text: COLORS2.subtext,
    accent: COLORS2.subtext,
  },
};
