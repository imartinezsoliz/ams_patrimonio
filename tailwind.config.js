/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        crimson: "#BA0C2F",
        navy: "#002855",
        // Chuquisaca Heritage Play Color Palette
        primary: {
          DEFAULT: "#900020",
          container: "#BA0C2F", // Signature Chuquisaca Crimson
          fixed: "#FFDAD9",
          "fixed-dim": "#FFB3B3",
        },
        secondary: {
          DEFAULT: "#B42436",
          container: "#FD5B66",
          fixed: "#FFDAD9",
          "fixed-dim": "#FFB3B3",
        },
        tertiary: {
          DEFAULT: "#434647",
          container: "#5B5D5F",
          fixed: "#E1E2E4",
        },
        surface: {
          DEFAULT: "#F9FAFB",
          bright: "#F9FAFB",
          dim: "#D0DBED",
          variant: "#D9E3F6",
          container: {
            lowest: "#FFFFFF",
            low: "#EFF4FF",
            DEFAULT: "#E6EEFF",
            high: "#DEE9FC",
            highest: "#D9E3F6",
          }
        },
        "on-surface": {
          DEFAULT: "#121C2A",
          variant: "#5B616E",
        },
        "on-primary": {
          DEFAULT: "#FFFFFF",
          container: "#FFC9C9",
        },
        "inverse-surface": "#27313F",
        "inverse-on-surface": "#EAF1FF",
        outline: {
          DEFAULT: "#8F6F6F",
          variant: "#E5E7EB",
        },
        error: {
          DEFAULT: "#BA1A1A",
          container: "#FFDAD6",
        }
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top, 0px)",
        "safe-bottom": "env(safe-area-inset-bottom, 0px)",
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'subtle': '0 1px 8px rgba(0, 0, 0, 0.04)',
        'elevated': '0 8px 24px -4px rgba(186, 12, 47, 0.25)',
      }
    },
  },
  plugins: [],
}
