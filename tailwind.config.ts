import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

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
        navy: {
          50: "#EEF3F8",
          100: "#D6E2EE",
          200: "#A9C4DC",
          300: "#7BA5CA",
          400: "#3F6C97",
          500: "#123A61",
          600: "#0E2E4E",
          700: "#0B2A4A",
          800: "#081E36",
          900: "#051220",
        },
        saffron: {
          50: "#FEF6EC",
          100: "#FDE8CB",
          300: "#F7BE73",
          400: "#F4A83D",
          500: "#F2921D",
          600: "#D97A0E",
          700: "#B4620B",
        },
        federal: {
          green: "#0F8B5F",
          "green-dark": "#0B6A48",
        },
        electric: "#00F5FF",
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
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "float-slow": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        "pulse-ring": { "0%": { transform: "scale(0.9)", opacity: "0.8" }, "100%": { transform: "scale(1.9)", opacity: "0" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.5s cubic-bezier(0.4,0,0.6,1) infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
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
