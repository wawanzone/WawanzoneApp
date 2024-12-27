const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    primary: '#007bff', // primary color for light mode
    success: '#28a745', // success color for light mode
    danger: '#dc3545',  // danger color for light mode
    warning: '#ffc107', // warning color for light mode
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    primary: '#0d6efd', // primary color for dark mode
    success: '#198754', // success color for dark mode
    danger: '#dc3545',  // danger color for dark mode
    warning: '#ffc107', // warning color for dark mode
  },
};

