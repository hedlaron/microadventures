export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
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