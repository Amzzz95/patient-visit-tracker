import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    brand: {
      50: "#f0fffe",
      500: "#0f5f63",
      600: "#0a3f41",
      900: "#05282b",
    },
  },
  config: {
    initialColorMode: "system",
    useSystemColorMode: true,
  },
});
