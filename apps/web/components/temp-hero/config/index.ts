export const HERO_IMAGES = {
  girl: "https://res.cloudinary.com/drf3eatfm/image/upload/v1767206478/nitrutsav-2026/gbm94mbh547tfiubue0s.webp",
  background:
    "https://res.cloudinary.com/drf3eatfm/image/upload/v1767206477/nitrutsav-2026/dc25xlv5laevejdndtux.webp",
  peacockBehind: "https://www.figma.com/api/mcp/asset/956c785f-f510-493e-a8e9-0f83edb9a487",
  owlLeft:
    "https://res.cloudinary.com/drf3eatfm/image/upload/v1767206949/nitrutsav-2026/rav1lsbvo1unchh4ty5b.webp",
  owlRight:
    "https://res.cloudinary.com/drf3eatfm/image/upload/v1767206949/nitrutsav-2026/l9yqzy8xgeu9w9ds4rrw.webp",
  peacockLeft:
    "https://res.cloudinary.com/drf3eatfm/image/upload/v1767206950/nitrutsav-2026/xc5dbtscmo7gnbso2dvf.webp",

  logo: "/hero/logo.svg",
} as const;

export const PARALLAX_MOUSE = {
  background: { x: 0.3, y: 0.15 },
  girl: { x: 2, y: 0.9 },
  peacockBehind: { x: 1.8, y: 0.8 },
  owls: { x: 1.5, y: 0.8 },
  peacockFeathers: { x: 1.2, y: 0.6 },
  owlRight: { x: 1.1, y: 0.5 },
  flowers: { x: 1.2, y: 0.6 },
  logo: { x: 0.6, y: 0.3 },
  lightStrings: { x: 15, y: 10 },
} as const;

export const PARALLAX_SCROLL = {
  background: 0.1,
  girl: 0.35,
  peacockBehind: 0.3,
  owls: 0.2,
  flowers: 0.25,
  logo: 0.25,
  lightStrings: 0.15,
} as const;

export const TRANSITIONS = {
  background: 0.15,
  girl: 0.15,
  peacockBehind: 0.15,
  owls: 0.15,
  flowers: 0.15,
  logo: 0.2,
  lightStrings: 0.25,
} as const;
