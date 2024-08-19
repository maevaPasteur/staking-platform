import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { fa } from "vuetify/iconsets/fa";
import { createVuetify } from "vuetify";

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: "#F7F7F9",
    surface: "#FFFFFF",
    primary: "#646CF6",
    "primary-darken-1": "#4f53c1",
    secondary: "#F2B84D",
    "secondary-darken-1": "#c99a43",
    error: "#F18880",
    info: "#5FC3F4",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
};

export default createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
      fa,
    },
  },
  theme: {
    defaultTheme: "myCustomLightTheme",
    themes: {
      myCustomLightTheme,
    },
  },
});
