import React from 'react';
import Landing from './Landingpage';
import Navbar from './components/navbar';
import Profile from './Profile.js';
import Dashboard from './Dashboard'
import { extendTheme,ChakraProvider } from '@chakra-ui/react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';


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

function App() {
    return (
        <BrowserRouter>

 
        <ChakraProvider theme = {theme}>
        <Navbar />
        <Routes>
        <Route exact path="/" element={<Landing/>} />
        <Route exact path="/dashboard" element={<Dashboard/>} />
        <Route exact path="/profile" element={<Profile/>} />
        </Routes>
        </ChakraProvider>
        </BrowserRouter>
    );
  }
  
  export default App;