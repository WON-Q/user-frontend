/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B35",
        "primary-dark": "#C75000",
        "primary-light": "#FFF0EB",
        secondary: "#FFD166",
        navy: "#004E89",
        mint: "#70E4B0",
        success: "#70E4B0",
        error: "#FF3B30",
        warning: "#FFCC00",
        info: "#007AFF",
        "text-black": "#1A1A1A",
        "text-dark": "#4A4A4A",
        "text-light": "#767676",
        "border-gray": "#E0E0E0",
        "blue-white": "#F8F8F8",
      },
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
      },
      fontSize: {
        h1: ["28px", { lineHeight: "1.3", fontWeight: "700" }],
        "h1-mobile": ["24px", { lineHeight: "1.3", fontWeight: "700" }],
        h2: ["24px", { lineHeight: "1.4", fontWeight: "700" }],
        "h2-mobile": ["20px", { lineHeight: "1.4", fontWeight: "700" }],
        h3: ["20px", { lineHeight: "1.4", fontWeight: "600" }],
        "h3-mobile": ["18px", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "1.4", fontWeight: "400" }],
      },
      borderRadius: {
        button: "8px",
        card: "12px",
      },
    },
  },
  plugins: [],
};
