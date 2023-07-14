import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import api from "./components/api";
import {
  Box,
  Button,
  HStack,
  Flex,
  FormControl,
  FormLabel,
  chakra,
  Input,
  Text,
  useToast,
  VStack,
  GridItem,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import {FiPlusCircle } from "react-icons/fi";
import {FaEnvelope} from "react-icons/fa"
import {renderTasks,fetchTags,fetchTasks} from "./components/helpers"
import { BsFillShieldFill } from 'react-icons/bs';

const Profile = () => {
  const [userTok, setUserTok] = useState();
  const [userDeets, setUserDeets] = useState(null);
  const [tasks, setTasks] = useState([]);
  const toast = useToast();
  const [tags, setTags] = useState([]);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
    assignedUsers: [],
    assignedTags: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const authTok = localStorage.getItem("authTok");
    if (!authTok) {
      navigate("/");
    } else {
      setUserTok(jwtDecode(authTok));
    }
  }, [navigate]);

  useEffect(() => {
    if (userTok) {
      async function fetchData() {
        try {
          const reply = await api.get("user/" + userTok.user.id);
          setUserDeets(reply.data.user);
        } catch (error) {
          console.log(error);
          navigate("/");
        }
      }
      fetchData();
      fetchTasks(userDeets,setTasks);
      fetchTags(setTags);
    }
  }, [userTok]);


  useEffect(() => { 
    fetchTasks(userDeets,setTasks);
    fetchTags(setTags);
  }, [userDeets]);
 
  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };
 

  const handleCreateTask = async () => {
    try {
      newTask.assignedUsers = [userDeets._id];
      const response = await api.put("/tasks/", newTask);
      await fetchTasks(); // Wait for tasks to be fetched
      setTasks([...tasks, response.data]);
      setShowNewTask(false);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        status: "Pending",
        assignedUsers: [userDeets._id],
        assignedTags: [],
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box px={8} py={24} mx="auto" minHeight="100vh" bg="brand.50">
      <VStack spacing={8} alignItems="center">
        <GridItem
  colSpan={{ base: "auto", lg: 7 }}
  textAlign={{ base: "center", lg: "left" }}
>
  
  {userDeets && (
    <VStack spacing={2} alignItems="center">
        <Flex
          shadow="lg"
          rounded="lg"
          bg="white"
          mb={8}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >

         <Box
            bg="brand.300"
            
            height="0%"
            width="100%"
            borderRadius="lg"
            p={7}
            display="flex"
            alignItems="left"
          >
            
  <Image
    src="https://i.imgur.com/hDr6l4z.jpg"
    alt="Profile Picture"
    borderRadius="90%"
    boxSize="200px"
    shadow="lg"
    mb={-20}
    borderColor="brand.800"
  />

          </Box> 
          <Box
            gridColumn="span 8"
            p={8}
            width="full"
            height="full"
            borderRadius="lg"
            textAlign="left"
            mt={10}
          >
          
            <Text
              fontSize="4xl"
              fontWeight="bold"
              color="brand.800"
            >
              {userDeets.fName} {userDeets.lName}
            </Text>
            <HStack
              spacing={3}
              color="brand.700"
            >
              <FaEnvelope size={20} />
              <Text fontSize="lg">{userDeets.email}</Text>
            </HStack>
            <HStack spacing = {3} color = "brand.700">
            <BsFillShieldFill size={20} />
            <Text fontSize="lg">{(userDeets.isAdmin)? ("Yes"):("No")}</Text>
            </HStack>
          </Box>
        </Flex>
    </VStack>
  )}
</GridItem>
        {/* Tasks */}
        <GridItem
          colSpan={{ base: "auto", lg: 7 }}
          textAlign={{ base: "center", lg: "left" }}
        >
          <chakra.h1
            mb={4}
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
            color="brand.300"
          >
            Tasks
          </chakra.h1>
          {/* New Task */}
          <Flex justifyContent="flex-end" mb={4}>
            <Button
              leftIcon={<FiPlusCircle />}
              colorScheme="brand"
              variant="solid"
              size="md"
              onClick={() => setShowNewTask(!showNewTask)}
            >
              {!showNewTask ?("New Task"): ("Cancel new task")}
            </Button>
          </Flex>

          {/* New Task Form */}
          {showNewTask && (
            <Box
              bg="brand.500"
              rounded="lg"
              shadow="lg"
              p={4}
              borderWidth={1}
              borderColor="gray.200"
              mb={4}
            >
              <chakra.h2 fontSize="xl" fontWeight="bold" mb={4}>
                Create New Task
              </chakra.h2>
              <FormControl id="title" mb={4}>
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="description" mb={4}>
                <FormLabel>Description</FormLabel>
                <Input
                  type="text"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="dueDate" mb={4}>
                <FormLabel>Due Date</FormLabel>
                <Input
                  type="date"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                />
              </FormControl>
              <Button
                colorScheme="brand"
                variant="solid"
                size="sm"
                onClick={handleCreateTask}
              >
                Create Task
              </Button>
            </Box>
          )}

          {/* Task Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {tags && renderTasks(tasks, tags,toast,setTasks,userDeets)}
</SimpleGrid>
        </GridItem>
      </VStack>
    </Box>
  );
};

export default Profile;