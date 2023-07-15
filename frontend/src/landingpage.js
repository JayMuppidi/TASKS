import React, { useState,useEffect } from "react";
import {Navigate} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from './components/api';
import {
  chakra,
  Box,
  GridItem,
  Text,
  Button,
  Flex,
  HStack,
  VisuallyHidden,
  Input,
  VStack,
  Switch,
} from "@chakra-ui/react";

export default function Landing() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitted,setIsSubmitted]= useState(false);
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");      
  const navigate = useNavigate();

  useEffect(() => {
    const authTok = localStorage.getItem("authTok");
    if (authTok) {
      navigate("/profile")
    } 
  }, [navigate]);

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    const signupValues = {
      fName: signupFirstName,
      lName: signupLastName,
      email: signupEmail,
      pword: signupPassword,
      isAdmin: isAdmin,
    };
    try {
      const response = await api.post("/auth/signup", signupValues);
      const { token, error } = response.data;
      if (error) {
        console.error(error);
      } else {
        if (response.status === 201) {
          setIsSubmitted(true);
          localStorage.setItem("authTok", token);
          localStorage.setItem("user", true);
        }
      }
    } catch (error) {
      
      console.log("Signup failed:", error);
    }
  };

  const handleSigninSubmit = async (event) => {
    event.preventDefault();
    const signinValues = {
      "email": signinEmail,
      "pword": signinPassword,
    };
    try {
      const response = await api.post("/auth/login", signinValues);
      const { token, error } = response.data;
      if (error) {
        console.error(error);
      } else {
        if (response.status === 200) {
          setIsSubmitted(true);
          localStorage.setItem("authTok", token);
          localStorage.setItem("user", true);
          navigate("/profile");
        }
      }
    } catch (error) {
      console.error("Signin failed:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (isSignUp) {
      if (name === "firstName") {
        setSignupFirstName(value);
      } else if (name === "lastName") {
        setSignupLastName(value);
      } else if (name === "email") {
        setSignupEmail(value);
      } else if (name === "password") {
        setSignupPassword(value);
      }
    } else {
      if (name === "email") {
        setSigninEmail(value);
      } else if (name === "password") {
        setSigninPassword(value);
      }
    }
  };
  if(isSubmitted) return ( <Navigate replace to="/Profile" />);
  else return (
    <Box px={8} py={24} mx="auto" minHeight="100vh" bg="brand.50">
      <VStack spacing={8} alignItems="center">
        <GridItem
          colSpan={{ base: "auto", lg: 7 }}
          textAlign={{ base: "center", lg: "left" }}
        >
          <chakra.h1
            mb={4}
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
            lineHeight={{ base: "shorter", md: "none" }}
            color="gray.900"
            _dark={{ color: "gray.200" }}
            letterSpacing={{ base: "normal", md: "tight" }}
          >
            Ready to increase your team's productivity?
          </chakra.h1>
        </GridItem>
        <GridItem colSpan={{ base: "auto", md: 4 }}>
          <Flex
            as="form"
            direction="column"
            alignItems="center"
            rounded="lg"
            shadow="xl"
            bg="brand.200"
            px={8}
            py={6}
            maxW="md"
            w="full"
            onSubmit={isSignUp ? handleSignupSubmit : handleSigninSubmit}
          >
            {isSignUp ? (
              <>
              <VisuallyHidden>First Name</VisuallyHidden>
              <Input
                my={2}
                type="text"
                placeholder="First Name"
                _placeholder={{ color: "brand.500" }}
                name="firstName"
                value={signupFirstName}
                onChange={handleInputChange}
              />

              <VisuallyHidden>Last Name</VisuallyHidden>
              <Input
                my={2}
                type="text"
                placeholder="Last Name"
                _placeholder={{ color: "brand.500" }}
                name="lastName"
                value={signupLastName}
                onChange={handleInputChange}
              />

              <VisuallyHidden>Email Address</VisuallyHidden>
              <Input
                my={2}
                type="email"
                placeholder="Email Address"
                _placeholder={{ color: "brand.500" }}
                name="email"
                value={signupEmail}
                onChange={handleInputChange}
              />

              <VisuallyHidden>Password</VisuallyHidden>
              <Input
                my={2}
                type="password"
                placeholder="Password"
                _placeholder={{ color: "brand.500" }}
                name="password"
                value={signupPassword}
                onChange={handleInputChange}
              />
              
<HStack>
  <Text fontWeight={!isAdmin ? "bold" : "normal"}>Normal User</Text>
  <Switch
    isChecked={isAdmin}
    onChange={()=>setIsAdmin(!isAdmin)}
    size="lg"
    mt={2}
    mb={4}
  />
  <Text fontWeight={isAdmin ? "bold" : "normal"}>Admin</Text>
</HStack>
              
            </>
          ) : (
            <>
              <VisuallyHidden>Email Address</VisuallyHidden>
              <Input
                my={2}
                type="email"
                placeholder="Email Address"
                _placeholder={{ color: "brand.500" }}
                name="email"
                value={signinEmail}
                onChange={handleInputChange}
              />

              <VisuallyHidden>Password</VisuallyHidden>
              <Input
                my={2}
                type="password"
                placeholder="Password"
                _placeholder={{ color: "brand.500" }}
                name="password"
                value={signinPassword}
                onChange={handleInputChange}
              />
            </>
          )}

          <Button
            colorScheme="brand"
            w="full"
            py={3}
            my={4}
            type="submit"
            bg="brand.500"
            _hover={{ bg: "brand.600" }}
          >
            {isSignUp ? "Sign up for free" : "Sign in"}
          </Button>
          <Button
              my = {2}
              variant="link"
              color = "brand.50"
              colorScheme="brand"
              onClick={()=>setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Sign in instead" : "Create an account"}
            </Button>


        </Flex>
      </GridItem>
    </VStack>
  </Box>
);

          }