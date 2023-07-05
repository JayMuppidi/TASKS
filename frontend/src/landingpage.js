import React, { useState } from "react";
import {
  chakra,
  Box,
  GridItem,
  Button,
  Center,
  Flex,
  Icon,
  SimpleGrid,
  VisuallyHidden,
  Input,
  VStack,
  ChakraBaseProvider,
  Switch,
} from "@chakra-ui/react";

export default function App() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  const handleToggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  const handleToggleAdmin = () => {
    setIsAdmin(!isAdmin);
  };

  const handleSignupSubmit = (event) => {
    event.preventDefault();
    const signupValues = {
      firstName: signupFirstName,
      lastName: signupLastName,
      email: signupEmail,
      password: signupPassword,
      isAdmin: isAdmin,
    };
    
  };

  const handleSigninSubmit = (event) => {
    event.preventDefault();
    const signinValues = {
      email: signinEmail,
      password: signinPassword,
    };
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

  return (
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
                bg="white"
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
                bg="white"
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
                bg="white"
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
                bg="white"
                _placeholder={{ color: "brand.500" }}
                name="password"
                value={signupPassword}
                onChange={handleInputChange}
              />

              <Switch
                colorScheme="brand"
                isChecked={isAdmin}
                onChange={handleToggleAdmin}
                size="lg"
                mt={2}
                mb={4}
              >
                {isAdmin ? "Admin" : "Normal User"}
              </Switch>
            </>
          ) : (
            <>
              <VisuallyHidden>Email Address</VisuallyHidden>
              <Input
                my={2}
                type="email"
                placeholder="Email Address"
                bg="white"
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
                bg="white"
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
              py={3}
              w="full"
              colorScheme="blue"
              leftIcon={
                <Icon
                  mr={2}
                  aria-hidden="true"
                  boxSize={6}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="transparent"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.283,10.356h-8.327v3.451h4.792c-0.446,2.193-2.313,3.453-4.792,3.453c-2.923,0-5.279-2.356-5.279-5.28	c0-2.923,2.356-5.279,5.279-5.279c1.259,0,2.397,0.447,3.29,1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233	c-4.954,0-8.934,3.979-8.934,8.934c0,4.955,3.979,8.934,8.934,8.934c4.467,0,8.529-3.249,8.529-8.934	C20.485,11.453,20.404,10.884,20.283,10.356z" />
                </Icon>
              }
              bg="blue"
              _hover={{ bg: "blue.100" }}
            >
              Login using Google
            </Button>

          <Button
              my = {2}
              variant="link"
              colorScheme="brand"
              onClick={handleToggleSignUp}
            >
              {isSignUp ? "Sign in instead" : "Create an account"}
            </Button>


        </Flex>
      </GridItem>
    </VStack>
  </Box>
);

          }