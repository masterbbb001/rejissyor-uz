import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Cinema palette
        void: "#0A0A0C",        // deepest background, the theater dark
        screen: "#151318",      // the "movie screen" surface
        reel: "#1E1B22",        // card / panel surface, one step up
        marquee: "#C9A227",     // marquee gold — primary accent
        "marquee-bright": "#E8C158",
        curtain: "#7A1F3D",     // velvet curtain red — danger / horror accent
        "curtain-bright": "#A22C52",
        projector: "#EDE7D9",   // warm off-white, projector light on screen
        muted: "#6B6870",
        grain: "#2A2730",
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        vignette:
          "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)",
        "film-grain":
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, transparent 1px, transparent 2px)",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.85" },
          "94%": { opacity: "1" },
          "96%": { opacity: "0.9" },
          "97%": { opacity: "1" },
        },
        "reel-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "leader-count": {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "15%": { transform: "scale(1)", opacity: "1" },
          "85%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(1.15)", opacity: "0" },
        },
        "sweep-line": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-1%, -2%)" },
          "30%": { transform: "translate(2%, 1%)" },
          "50%": { transform: "translate(-2%, 2%)" },
          "70%": { transform: "translate(1%, -1%)" },
          "90%": { transform: "translate(-1%, 1%)" },
        },
      },
      animation: {
        flicker: "flicker 6s infinite",
        "reel-spin": "reel-spin 3s linear infinite",
        "leader-count": "leader-count 1s ease-in-out infinite",
        "sweep-line": "sweep-line 2s linear infinite",
        "fade-up": "fade-up 0.5s ease-out forwards",
        grain: "grain 1.2s steps(4) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
