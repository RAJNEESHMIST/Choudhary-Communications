export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#0F172A',
        accent: '#F59E0B',
        success: '#10B981',
        danger: '#EF4444',
        surface: '#FFFFFF',
        muted: '#475569',
        bg: '#F8FAFC',
        border: '#E2E8F0'
      },
      boxShadow: {
        float: '0 18px 50px rgba(15, 23, 42, 0.08)',
        panel: '0 10px 30px rgba(15, 23, 42, 0.08)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
