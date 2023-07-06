import React from "react";
import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  VisuallyHidden,
  HStack,
  Button,
  useDisclosure,
  VStack,
  IconButton,
  CloseButton,
  Avatar,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  AiFillHome,
  AiOutlineMenu,
  AiOutlineBell,
} from "react-icons/ai";
import { BsPlus } from "react-icons/bs";

export default function Navbar() {
  const bg = useColorModeValue("white", "brand.800");
  const mobileNav = useDisclosure();
  return (
    <React.Fragment>
      <chakra.header
        bg={"brand.300"}
        w="full"
        px={{ base: 2, sm: 4 }}
        py={4}
        shadow="md"
      >
        <Flex alignItems="center" justifyContent="space-between" mx="auto">
          <HStack display="flex" spacing={3} alignItems="center">
            <Box display={{ base: "inline-flex", md: "none" }}>
              <IconButton
                display={{ base: "flex", md: "none" }}
                aria-label="Open menu"
                fontSize="20px"
                color="gray.800"
                _dark={{ color: "inherit" }}
                variant="ghost"
                icon={<AiOutlineMenu />}
                onClick={mobileNav.onOpen}
              />
              <VStack
                pos="absolute"
                top={0}
                left={0}
                right={0}
                display={mobileNav.isOpen ? "flex" : "none"}
                flexDirection="column"
                p={2}
                pb={4}
                m={2}
                bg={bg}
                spacing={3}
                rounded="sm"
                shadow="sm"
              >
                <CloseButton
                  aria-label="Close menu"
                  justifySelf="self-start"
                  onClick={mobileNav.onClose}
                />
              </VStack>
            </Box>
            

            <HStack spacing={3} display={{ base: "none", md: "inline-flex" }}>
              <Button variant="ghost" leftIcon={<AiFillHome />} size="sm">
                Dashboard
              </Button>
            </HStack>
          </HStack>

          <SimpleGrid flex="1" minChildWidth="120px" spacing="20px" justifyItems="center">
            <Box
              p={2}
              bg="brand.500"
              rounded="md"
              shadow="md"
              display="flex"
              alignItems="center"
            >
              <chakra.p
                fontSize="2xl"
                fontWeight="bold"
                color="gray.800"
                _dark={{ color: "gray.200" }}
                textTransform="uppercase"
                letterSpacing="wider"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  as="span"
                  bgGradient="linear(to-r, brand.300, brand.50)"
                  bgClip="text"
                  fontWeight="bold"
                >
                  T
                </Box>
                asks
              </chakra.p>
            </Box>
          </SimpleGrid>


          <HStack
            spacing={3}
            display={mobileNav.isOpen ? "none" : "flex"}
            alignItems="center"
          >
            <Button
              colorScheme="brand"
              color="brand.50"
              textColor="White"
              leftIcon={<BsPlus />}
            >
              New Task
            </Button>

            <chakra.a
              p={3}
              color="gray.800"
              _dark={{ color: "inherit" }}
              rounded="sm"
              _hover={{ color: "gray.800", _dark: { color: "gray.600" } }}
            >
              <AiOutlineBell />
              <VisuallyHidden>Notifications</VisuallyHidden>
            </chakra.a>

            <Avatar
              size="sm"
              name="Dan Abrahmov"
              src="https://bit.ly/dan-abramov"
            />
          </HStack>
        </Flex>
      </chakra.header>
    </React.Fragment>
  );
}