export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Unified Orange/Yellow Color Palette
      colors: {
        // Primary brand colors - orange/yellow gradient scheme
        brand: {
          50: '#FEF7ED',   // Very light orange/yellow
          100: '#FEDFC7',  // Light orange/yellow
          200: '#FDC898',  // Light orange
          300: '#F4A261',  // Primary orange (from homepage gradient)
          400: '#E76F51',  // Secondary orange (from homepage gradient)  
          500: '#D84B40',  // Dark orange (hover state)
          600: '#C23E39',  // Darker orange
          700: '#A32F2A',  // Very dark orange
          800: '#7F2B24',  // Deep orange
          900: '#5C1F1A',  // Darkest orange
        },
        // Semantic color aliases using the orange palette
        primary: {
          50: '#FEF7ED',
          100: '#FEDFC7',
          200: '#FDC898',
          300: '#F4A261',  // Primary
          400: '#E76F51',  // Secondary
          500: '#D84B40',  // Dark
          600: '#C23E39',
          700: '#A32F2A',
          800: '#7F2B24',
          900: '#5C1F1A',
        },
        // Error/warning colors using orange instead of red
        error: {
          50: '#FEF7ED',
          100: '#FEDFC7',
          200: '#FDC898',
          300: '#F4A261',
          400: '#E76F51',
          500: '#D84B40',
          600: '#C23E39',
          700: '#A32F2A',
          800: '#7F2B24',
          900: '#5C1F1A',
        },
        warning: {
          50: '#FEF7ED',
          100: '#FEDFC7',
          200: '#FDC898',
          300: '#F4A261',
          400: '#E76F51',
          500: '#D84B40',
          600: '#C23E39',
          700: '#A32F2A',
          800: '#7F2B24',
          900: '#5C1F1A',
        },
        // Success colors using green palette
        success: {
          50: '#F0FDF4',   // Very light green
          100: '#DCFCE7',  // Light green  
          200: '#BBF7D0',  // Light green
          300: '#86EFAC',  // Medium light green
          400: '#4ADE80',  // Medium green
          500: '#22C55E',  // Primary green
          600: '#16A34A',  // Dark green
          700: '#15803D',  // Darker green
          800: '#166534',  // Very dark green
          900: '#14532D',  // Darkest green
        }
      },
      // Custom gradient backgrounds
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #F4A261 0%, #E76F51 100%)',
        'brand-gradient-hover': 'linear-gradient(135deg, #E76F51 0%, #D84B40 100%)',
      },
      aspectRatio: {
        '16/9': '16 / 9',
      },
      spacing: {
        'header': '64px', // 4rem for navbar height
      },
      height: {
        'screen-header': 'calc(100vh - 64px)',
      },
      maxHeight: {
        'screen-header': 'calc(100vh - 64px)',
      }
    },
  },
}