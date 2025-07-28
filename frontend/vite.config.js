import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  server: {
    proxy: {
      '/inventory': 'http://localhost:8001',
    },
  },
  optimizeDeps: {
    include: ['jwt-decode'], // ✅ Add this line
  },
  // content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        blueDark: "#233955",
        blueLight: "#A2F2EE",
        blueSubtle: "#DFF8F9",
        red30: "#FD4245",
        red20: "#FEBBBC",
        red10: "#FFE1E1",
        redSubtle: "#FFF4F4",
        blackN: "#05080B",
        whiteN: "#FFFFFF",
        gray30: "#4B4D4F",
        gray20: "#87888A",
        gray10: "#C3C4C4",
        grayLine: "#E6E6E7",
        grayBg: "#F0F0F0",
        grayBgSubtle: "#F5F5F5",
        grayHover: "#F3F9F9",
      },
      fontSize: {
        display1: ["32px", { fontWeight: "600" }], /*SemiBold*/
        display2: ["28px", { fontWeight: "600" }],
        display3: ["26px", { fontWeight: "600" }],
        display4: ["24px", { fontWeight: "400" }], /*Also used in SemiBold*/

        title1: ["22px", { fontWeight: "600" }], /*Can use 700 for Bold*/
        title1b: ["22px", { fontWeight: "700" }],
        title2: ["20px", { fontWeight: "600" }],
        title2b: ["20px", { fontWeight: "700" }],
        title3: ["18px", { fontWeight: "400" }],
        title3s: ["18px", { fontWeight: "600" }],
        title4: ["16px", { fontWeight: "400" }],
        title4s: ["16px", { fontWeight: "600" }],
        title4b: ["16px", { fontWeight: "700" }],

        buttonL: ["16px", { fontWeight: "600" }],
        buttonM: ["14px", { fontWeight: "600" }],
        buttonMr: ["14px", { fontWeight: "400" }],
        buttonS: ["12px", { fontWeight: "400" }],
        buttonXS:[ "11px", { fontWeight: "400" }],

        bodyN: ["16px", { fontWeight: "400" }],
        bodyS: ["16px", { fontWeight: "600" }],
        bodyB: ["16px", { fontWeight: "700" }],

        smallN: ["14px", { fontWeight: "400" }],
        smallS: ["14px", { fontWeight: "600" }],
        smallB: ["14px", { fontWeight: "700" }],

        xsmall: ["12px", { fontWeight: "400" }],
        xsmallS: ["12px", { fontWeight: "600" }],
        xsmallB: ["12px", { fontWeight: "700" }],
        xsmallAlt: ["11px", { fontWeight: "400", letterSpacing: "0.05em", textTransform: "uppercase" }],

        xxsmall: ["10px", { fontWeight: "400" }],
        xxsmallS: ["10px", { fontWeight: "600" }],
        xxsmallB: ["10px", { fontWeight: "700" }],
        xxsmallAlt: ["9px", { fontWeight: "400" }],

        xxxsmall: ["8px", { fontWeight: "400" }],
        xxxsmallS: ["8px", { fontWeight: "600" }]
      },
      boxShadow: {
        subtle: "0px 1px 2px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        md: "6px",
      },
  }
}
})


