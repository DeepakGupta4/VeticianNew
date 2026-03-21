// theme.js  –  Vatecian v4  (reference-image matched)
// ─────────────────────────────────────────────────────────────────
// Every colour, font size, shadow and radius used in the app lives
// here.  Reference image analysis:
//
//  Background ......... #f0f4ee  (very light grey-green)
//  Cards .............. #ffffff  with box-shadow: 0 2px 12px rgba(0,0,0,.08)
//  Title text ......... #1a1a1a  bold 20px
//  Body / bullet text . #444444  regular 12.5–13px
//  Muted / caption .... #888888
//  Primary green ...... #558B2F  (headers, active states)
//  Secondary green .... #7CB342  (buttons, badges, numbered circles, save text)
//  Badge (red pill) ... #e8524a  (POPULAR / BEST VALUE label)
//  Save text .......... #7CB342  green
// ─────────────────────────────────────────────────────────────────

export const COLORS = {
  primary:    '#558B2F',
  secondary:  '#7CB342',

  // Tints — derived from primary, used for icon backgrounds / hover
  tint:       '#f0f7e6',   // very light green fill (icon circles, hover bg)
  tintMid:    '#d4e8b0',   // input borders, dividers

  // Neutrals — exactly from reference image
  bg:         '#f0f4ee',   // app page background
  card:       '#ffffff',   // card surface
  border:     '#e2e8d8',   // card border

  // Typography — reference image colours
  textPrimary:   '#1a1a1a',  // bold headings, plan names, groomer names
  textSecondary: '#444444',  // bullet items, feature lists, body copy
  textMuted:     '#888888',  // descriptions, meta info, /month label

  // Accent — red pill badge from reference
  badgeRed:   '#e8524a',

  // Dark header
  headerDark: '#2a4716',

  white: '#ffffff',
};

// Box shadow — exact reference style (very subtle, no colour tint)
export const SHADOW = '0 2px 12px rgba(0, 0, 0, 0.08)';

// Typography scale  (px)
export const FONT = {
  sectionTitle: 20,   // "Subscription Plans", "How It Works"
  planName:     15,   // "Weekly Grooming"
  priceBig:     32,   // "₹2,499"
  priceSub:     13,   // "/month"
  saveText:     13,   // "Save ₹700"
  bulletItem:   12.5, // feature bullet text
  btnLabel:     14,   // "Subscribe" button
  howTitle:     14,   // step title in How It Works
  howDesc:      12.5, // step description
  groomerName:  14,
  groomerMeta:  12,
  body:         13,
  caption:      11,
};

// Border radius  (px)
export const RADIUS = {
  pill:  50,  // pet selector pills, badge
  card:  14,  // main card radius  (ref: 14–16px)
  btn:   10,  // Subscribe / Book buttons
  icon:  12,  // icon square backgrounds
  num:   18,  // numbered circle (full round)
};
