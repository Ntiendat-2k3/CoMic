import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Đổi primary sang màu xanh than đen
      colors: {
        primary: {
          DEFAULT: "#001f3f", // Xanh than đen
          light: "#26374a", // Màu nhạt hơn
          dark: "#000f20", // Màu đậm hơn
          accent: '#38bdf8',
        },
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(to right, #020617, #0f172a, #1e293b)',
      },
      animation: {
        gradient: 'gradient 3s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '100% 50%' },
        },
      },
      fontFamily: {
        love: ["'Love Ya Like A Sister', cursive"],  
      },
      // Giới hạn max-width container = 1200px
      container: {
        center: true,
        padding: "1rem",
        screens: {
          xl: "1200px",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
