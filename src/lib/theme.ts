import { createTheme } from '@mui/material/styles'
import '@fontsource/titillium-web/300.css'
import '@fontsource/titillium-web/400.css'
import '@fontsource/titillium-web/600.css'
import '@fontsource/titillium-web/700.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#06c',
    },
    secondary: {
      main: '#5c6f82',
    },
    background: {
      default: '#fff',
    },
    text: {
      primary: '#19191a',
      secondary: '#3d4955',
      disabled: '#5a768a',
    },
    error: {
      main: '#d9364f',
    },
    warning: {
      main: '#a66300',
    },
    info: {
      main: '#979899',
    },
    success: {
      main: '#008758',
    },
  },
  typography: {
    fontFamily: ['"Titillium Web"', 'sans-serif'].join(', '),
    fontSize: 16,
    htmlFontSize: 16,
    h1: {
      fontSize: 40,
      fontWeight: 700,
    },
    h2: {
      fontSize: 32,
      fontWeight: 700,
    },
    h3: {
      fontSize: 28,
      fontWeight: 700,
    },
    h4: {
      fontSize: 24,
      ontWeight: 600,
    },
    h5: {
      fontSize: 20,
      fontWeight: 400,
    },
    h6: {
      fontSize: 16,
      fontWeight: 600,
      lineHeight: 1.28,
    },
    subtitle1: {
      fontSize: 20,
      lineHeight: 1.35,
    },
    body1: {
      fontSize: 18,
      fontWeight: 300,
      lineHeight: 1.35,
    },
    body2: {
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.2,
    },
    button: {
      fontWeight: 600,
      lineHeight: 1.2,
      textTransform: 'none',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 4,
  },
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          padding: '12px 24px',
          boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 15%), 0 1px 1px rgb(0 0 0 / 8%)',
          '&:hover': {
            boxShadow: 'inherit',
          },
        },
      },
      variants: [
        {
          props: { color: 'secondary' },
          style: {
            backgroundColor: '#5c6f82',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#4c5c6c',
            },
          },
        },
        {
          props: { variant: 'text' },
          style: {
            boxShadow: 'none',
          },
        },
      ],
    },
  },
})
export default theme
