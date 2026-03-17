import { createTheme, MantineColorsTuple, rem, MantineTheme } from '@mantine/core';

const violet: MantineColorsTuple = [
  '#f5f3ff',
  '#ede9fe',
  '#ddd6fe',
  '#c4b5fd',
  '#a78bfa',
  '#8b5cf6',
  '#7c3aed',
  '#6d28d9',
  '#5b21b6',
  '#4c1d95',
];

export const theme = createTheme({
  primaryColor: 'violet',
  colors: {
    violet,
  },
  fontFamily: 'Outfit, Plus Jakarta Sans, Inter, sans-serif',
  headings: {
    fontFamily: 'Outfit, Plus Jakarta Sans, Inter, sans-serif',
    fontWeight: '800',
  },
  defaultRadius: 'md',
  shadows: {
    xs: '0 1px 2px rgba(0,0,0,0.05)',
    sm: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    md: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    lg: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
    xl: '0 25px 50px -12px rgba(0,0,0,0.25)',
  },
  components: {
    Card: {
      defaultProps: {
        radius: 'lg',
        padding: 'xl',
        shadow: 'sm',
      },
      styles: {
        root: {
          border: '1px solid var(--mantine-color-default-border)',
        }
      }
    },
    Button: {
      defaultProps: {
        radius: 'md',
        fw: 600,
      },
    },
    NavLink: {
      styles: (theme: MantineTheme) => ({
        root: {
          borderRadius: theme.radius.md,
          fontWeight: 600,
          transition: 'all 0.2s ease',
        },
      })
    }
  }
});
