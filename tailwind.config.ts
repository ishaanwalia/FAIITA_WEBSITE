import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // "Tricolour Ink" palette.
        //
        // The scale names stay `navy` / `saffron` deliberately: they're used in
        // several hundred places across the app, and re-theming at the token
        // level re-skins the whole site from this one file. The values are what
        // changed, not the vocabulary.
        //
        // navy is now a near-black ink rather than a mid-blue. The old #081E36
        // was bright enough to compete with the accent for attention, which is
        // exactly why the orange read as flat — a neutral ground lets one accent
        // carry the page.
        navy: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#475569",
          600: "#334155",
          700: "#1E293B",
          800: "#131C2E",
          900: "#0B1220",
        },
        // saffron is now BHL's orange. 700 is the on-light text stop (#C2410C
        // clears 4.5:1 on white); 400 is the on-dark stop.
        saffron: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
        },
        federal: {
          green: "#0F8B5F",
          "green-dark": "#0B6A48",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Shared elevation scale — cards/tiles reach for these instead of
      // hand-rolling a one-off shadow value each, so depth reads
      // consistently across the site.
      // Tinted with the ink (#0B1220 → 11,18,32), not pure black — a shadow
      // that shares the ground's hue reads as depth; a grey one reads as dirt.
      boxShadow: {
        card: "0 2px 8px rgba(11,18,32,0.06), 0 16px 40px -12px rgba(11,18,32,0.18)",
        "card-hover": "0 4px 12px rgba(11,18,32,0.08), 0 28px 60px -14px rgba(11,18,32,0.28)",
        elevated: "0 8px 30px rgba(11,18,32,0.35)",
        // Accent glow for cards that need to lead (1.11). Kept in the scale so
        // nobody hand-rolls a one-off orange shadow per component.
        glow: "0 0 0 1px rgba(249,115,22,0.35), 0 12px 34px -12px rgba(249,115,22,0.45)",
        "glow-green": "0 0 0 1px rgba(15,139,95,0.30), 0 12px 34px -12px rgba(15,139,95,0.40)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "float-slow": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        "pulse-ring": { "0%": { transform: "scale(0.9)", opacity: "0.8" }, "100%": { transform: "scale(1.9)", opacity: "0" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        // Slow drift behind the hero photography. Alternating in/out per frame
        // stops consecutive photos all moving the same way, which reads as a
        // mechanical slideshow rather than a considered cross-fade.
        "kenburns-in": { "0%": { transform: "scale(1.04)" }, "100%": { transform: "scale(1.13)" } },
        "kenburns-out": { "0%": { transform: "scale(1.13)" }, "100%": { transform: "scale(1.04)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.5s cubic-bezier(0.4,0,0.6,1) infinite",
        marquee: "marquee 30s linear infinite",
        // 12s against a 3s hold: the drift never completes, so it always reads
        // as slow movement rather than a loop resetting.
        "kenburns-in": "kenburns-in 12s ease-out both",
        "kenburns-out": "kenburns-out 12s ease-out both",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    // `hover:` should only apply on devices that actually have a hover
    // state. Touch browsers otherwise "stick" the :hover styles after a
    // tap until the next tap elsewhere, leaving cards/buttons visibly
    // offset/enlarged site-wide (GlassCard lift, MagneticButton scale,
    // etc.) until something else is touched.
    plugin(({ addVariant }) => {
      addVariant("hover", "@media (hover: hover) { &:hover }");
      addVariant("group-hover", "@media (hover: hover) { :merge(.group):hover & }");
    }),
  ],
};

export default config;
