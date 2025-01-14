// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {

    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }
    },


    extend: {
      colors: {
        lightBackground: '#EBEAE1', // Light theme background color
        darkBackground: '#000000', // Dark theme background color
        darkBase: '#1A202C', // Dark theme base color
        borderColor: '#009FA9', // Border color for both themes
        buttonColor: '#082f49', // Button color for light theme
        spaceArea:'#fff2d1',
      },
      backdropBlur: {
        'md': '10px',
      },
      keyframes: {
        explosion: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.5' },
          '100%': { transform: 'scale(2)', opacity: '0' },
          
        }
      },

      animation: {
        'explosion': 'explosion 0.5s ease-out',
        'fade-in-down': 'fadeInDown 1s ease-out',
        'fade-in-up': 'fadeInUp 1s ease-out',
        'bounce': 'bounce 1s infinite',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
      },

      fontFamily: {
        b1: ["KalamehThin", "system-ui"],
        b2: ["KalamehExtraLight", "system-ui"],
        b3: ["KalamehLight", "system-ui"],
        b4: ["KalamehRegular", "system-ui"],
        b5: ["KalamehMedium", "system-ui"],
        b6: ["KalamehSemiBold", "system-ui"],
        b7: ["KalamehBold", "system-ui"],
        b8: ["KalamehExtraBold", "system-ui"],
        b9: ["KalamehBlack", "system-ui"],
      },

      // screens: {
      //   'sm': '640px',
      //   sm: '640px',
      //   'md': '768px',
      //   'lg': '1024px',
      //   'xl': '1280px',
      //   '2xl': '1536px',
      // },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
