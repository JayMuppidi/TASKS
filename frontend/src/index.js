import React from 'react';
import ReactDOM from 'react-dom/client';
import Landing from './landingpage';
import Navbar from './components/navbar';
import { extendTheme,ChakraProvider } from '@chakra-ui/react';
const root = ReactDOM.createRoot(document.getElementById('root'));

const colors = {
  brand: {
    50: "#f0e5f5",
    100: "#d6bedf",
    200: "#b396c8",
    300: "#9873b1",
    400: "#7a539b",
    500: "#623d86",
    600: "#4c2d6f",
    700: "#361f57",
    800: "#20123e",
    900: "#0a051d"
  }
};
const config = {
  initialColorMode: "dark",
  useSystemColorMode: true
};

const theme = extendTheme({ colors, config });

root.render(
  <ChakraProvider theme = {theme}>
  <Navbar  />
    <Landing />
  </ChakraProvider>
);


