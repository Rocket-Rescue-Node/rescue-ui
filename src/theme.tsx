import { createTheme } from "@mui/material/styles";
import { type PaletteColorOptions } from "@mui/material/styles/createPalette";

// Define the colors and other pieces of the theme.
const theme = createTheme({
  palette: {
    mode: "dark",
    // RPL-ish colors
    primary: {
      main: "#f7931e",
      light: "#FFDEC6",
      dark: "#ed6900",
    },
    // ETH-ish colors
    secondary: {
      main: "#7986cb",
      light: "#9fa8da",
      dark: "#3949ab",
    },
    gray: {
      main: "#aaaaaa",
      light: "#cccccc",
      dark: "#666666",
    },
  },
  typography: {
    fontFamily: "system-ui, sans-serif",
    button: {
      textTransform: "none",
    },
  },
});

// This introduces our custom "gray" palette to some MUI components
// so typescript stops barking about it.

declare module "@mui/material/styles" {
  interface CustomPalette {
    gray: PaletteColorOptions;
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

declare module "@mui/material/Alert" {
  interface AlertPropsColorOverrides {
    gray: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    gray: true;
  }
}

declare module "@mui/material/TextField" {
  interface TextFieldPropsColorOverrides {
    gray: true;
  }
}

export default theme;
