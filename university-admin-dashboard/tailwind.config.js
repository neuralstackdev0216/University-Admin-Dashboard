/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a73e8', // Blue for buttons/links
        sidebarBg: '#f8f9fa', // Light gray for sidebar
        sidebarActive: '#e8f0fe', // Lighter blue for active menu link
        textDark: '#202124', // Main heading color
        textGray: '#5f6368', // Subtitles and labels
        roleAdminBg: '#dceefc',
        roleAdminText: '#1967d2',
        roleEmployerBg: '#e6f4ea',
        roleEmployerText: '#137333',
        roleStudentBg: '#fef7e0',
        roleStudentText: '#b06000',
      }
    },
  },
  plugins: [],
}