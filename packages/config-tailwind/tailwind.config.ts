import type { Config } from "tailwindcss";
import { nextui } from '@nextui-org/react'

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  content: [
    "./src/**/*.{tsx,ts,js,jsx}",
    "./src/app/**/*.{tsx,ts,js,jsx}",
    "./src/containers/**/*.{tsx,ts,js,jsx}",
    "./src/components/**/*.{tsx,ts,js,jsx}",
    "./src/layouts/**/*.{tsx,ts,js,jsx}",
    "./src/providers/**/*.{tsx,ts,js,jsx}",
    "../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    '../../packages/ui/src/**/*.{ts,tsx}'
  ],
  darkMode: 'class',
  prefix: '',
  theme: {
    extend: {
      backgroundImage: {
        "glow-conic":
          "conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)",
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    nextui(),
  ],
};
export default config;
