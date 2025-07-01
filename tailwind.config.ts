import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#EC4899", // pink-500
          light: "#F472B6", // pink-400
          dark: "#DB2777", // pink-600
          accent: "#BE185D", // pink-700
          50: "#FDF2F8",
          100: "#FCE7F3",
          200: "#FBCFE8",
          300: "#F9A8D4",
          400: "#F472B6",
          500: "#EC4899",
          600: "#DB2777",
          700: "#BE185D",
          800: "#9D174D",
          900: "#831843",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#0A0A0A", // black
          light: "#1A1A1A", // dark gray
          dark: "#000000", // pure black
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "#F472B6", // pink-400
          light: "#F9A8D4", // pink-300
          dark: "#EC4899", // pink-500
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        glass: {
          dark: "rgba(0, 0, 0, 0.3)",
          pink: "rgba(236, 72, 153, 0.1)",
          "deep-pink": "rgba(219, 39, 119, 0.1)",
          white: "rgba(255, 255, 255, 0.1)",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #EC4899 0%, #F472B6 100%)",
        "gradient-secondary": "linear-gradient(135deg, #DB2777 0%, #EC4899 100%)",
        "gradient-accent": "linear-gradient(135deg, #F472B6 0%, #FBBF24 100%)",
        "gradient-dark": "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0F0F0F 100%)",
        "gradient-pink-glass": "linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(219, 39, 119, 0.1) 100%)",
        "dark-mystical": "linear-gradient(135deg, #0A0A0A, #1A1A1A, #0F0F0F, #1E1E1E, #0D0D0D)",
      },
      animation: {
        // Basic animations
        spin: "spin 1s linear infinite",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 1s infinite",

        // Dark mystical animations
        "dark-mystical-shift": "dark-mystical-shift 25s ease-in-out infinite",
        "mystical-pattern-drift": "mystical-pattern-drift 40s linear infinite",
        "float-dark-geometric": "float-dark-geometric 18s ease-in-out infinite",
        "dark-orb-float": "dark-orb-float 25s ease-in-out infinite",
        "dark-wave-move": "dark-wave-move 12s ease-in-out infinite",
        "dark-grid-pulse": "dark-grid-pulse 6s ease-in-out infinite",
        "dark-particle-float": "dark-particle-float 12s infinite linear",

        // Basic floating
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out infinite 2s",
        "pulse-pink": "pulse-pink 2.5s ease-in-out infinite",
        "shimmer-pink": "shimmer-pink 2.5s infinite",

        // Accordion animations
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        // Basic keyframes
        spin: {
          to: { transform: "rotate(360deg)" },
        },
        ping: {
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        },
        pulse: {
          "50%": {
            opacity: ".5",
          },
        },
        bounce: {
          "0%, 100%": {
            transform: "translateY(-25%)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "none",
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
          },
        },

        // Dark mystical keyframes
        "dark-mystical-shift": {
          "0%, 100%": {
            filter: "hue-rotate(0deg) brightness(0.8) contrast(1.2)",
          },
          "25%": {
            filter: "hue-rotate(15deg) brightness(0.9) contrast(1.3)",
          },
          "50%": {
            filter: "hue-rotate(30deg) brightness(0.7) contrast(1.4)",
          },
          "75%": {
            filter: "hue-rotate(45deg) brightness(0.85) contrast(1.1)",
          },
        },
        "mystical-pattern-drift": {
          "0%": {
            transform: "translate(0, 0) rotate(0deg)",
          },
          "25%": {
            transform: "translate(30px, -25px) rotate(90deg)",
          },
          "50%": {
            transform: "translate(-20px, 40px) rotate(180deg)",
          },
          "75%": {
            transform: "translate(40px, 15px) rotate(270deg)",
          },
          "100%": {
            transform: "translate(0, 0) rotate(360deg)",
          },
        },
        "float-dark-geometric": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg) scale(1)",
          },
          "33%": {
            transform: "translateY(-40px) rotate(120deg) scale(1.15)",
          },
          "66%": {
            transform: "translateY(25px) rotate(240deg) scale(0.85)",
          },
        },
        "dark-orb-float": {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1)",
          },
          "25%": {
            transform: "translate(60px, -40px) scale(1.2)",
          },
          "50%": {
            transform: "translate(-40px, 50px) scale(0.8)",
          },
          "75%": {
            transform: "translate(50px, -30px) scale(1.1)",
          },
        },
        "dark-wave-move": {
          "0%, 100%": {
            clipPath: "polygon(0 100%, 0 60%, 25% 70%, 50% 50%, 75% 75%, 100% 55%, 100% 100%)",
          },
          "50%": {
            clipPath: "polygon(0 100%, 0 75%, 25% 55%, 50% 70%, 75% 50%, 100% 65%, 100% 100%)",
          },
        },
        "dark-grid-pulse": {
          "0%, 100%": {
            opacity: "0.05",
          },
          "50%": {
            opacity: "0.12",
          },
        },
        "dark-particle-float": {
          "0%": {
            transform: "translateY(100vh) translateX(0)",
            opacity: "0",
          },
          "10%": {
            opacity: "1",
          },
          "90%": {
            opacity: "1",
          },
          "100%": {
            transform: "translateY(-100px) translateX(100px)",
            opacity: "0",
          },
        },

        // Basic keyframes
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
        },
        "pulse-pink": {
          "0%, 100%": {
            boxShadow: "0 0 25px rgba(236, 72, 153, 0.4)",
          },
          "50%": {
            boxShadow: "0 0 50px rgba(236, 72, 153, 0.8), 0 0 75px rgba(219, 39, 119, 0.5)",
          },
        },
        "shimmer-pink": {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },

        // Accordion keyframes
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      fontFamily: {
        love: ["'Love Ya Like A Sister', cursive"],
        sans: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(236, 72, 153, 0.1)",
        "glass-lg": "0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(236, 72, 153, 0.3)",
        "pink-glow": "0 0 25px rgba(236, 72, 153, 0.6)",
        "dark-pink-glow": "0 0 30px rgba(219, 39, 119, 0.7)",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
    },
  },
  plugins: [],
} satisfies Config
