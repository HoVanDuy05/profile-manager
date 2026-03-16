export const APP_CONFIG = {
  APP_NAME: 'VanDuy Admin',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://profile-be-js9l.onrender.com/api',
  STORAGE_KEY_THEME: 'admin-color-scheme',
};

export const ROUTES = {
  DASHBOARD: '/',
  PROFILE: '/profile',
  SKILLS: '/skills',
  PROJECTS: '/projects',
  EXPERIENCE: '/experience',
  MEDIA: '/media',
  MESSAGES: '/messages',
  SETTINGS: '/settings',
};

export const DEFAULT_TRANSITIONS = {
  duration: 0.3,
  ease: 'easeInOut',
};
