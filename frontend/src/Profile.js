import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import api from "./components/api";
import {
  chakra,
  Box,
  GridItem,
  Button,
  Center,
  Image,
  HStack,
  Flex,
  Icon,
  SimpleGrid,
  VisuallyHidden,
  Input,
  VStack,
  ChakraBaseProvider,
  Switch,
  Text,
  Badge,
  IconButton,
  useToast,
  Checkbox,
  Stack,
  Select,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import { FiTrash2, FiFilter ,FiPlusCircle } from "react-icons/fi";
import {FaEnvelope} from "react-icons/fa"
import { BsFillShieldFill } from 'react-icons/bs';

const Profile = () => {
  const [userTok, setUserTok] = useState();
  const [userDeets, setUserDeets] = useState(null);
  const [tasks, setTasks] = useState([]);
  const toast = useToast();
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
    }
  }, [userTok]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const deets = {
          "taskIds":userDeets.Tasks,
         }
        const reply = await api.post("/tasks/multiple",deets);
        setTasks(reply.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchTasks();
  }, [userDeets]);

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
      
      // Show a success toast notification
      toast({
        title: "Task Deleted",
        description: "Task has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      
      // Show an error toast notification
      toast({
        title: "Error",
        description: "An error occurred while deleting the task.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCompleteTask = async (taskId, checked) => {
    try {
      await api.put(`/tasks/updateStatus/${taskId}`, {
        status: checked ? "Completed" : "Pending",
      });
    } catch (error) {
      console.log(error);
    }
  };


  const handleShowNewTask = () => {
    setShowNewTask(!showNewTask);
  };


  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async () => {
    try {
      const response = await api.put("/tasks/", newTask);
      setTasks([...tasks, response.data]);
      setShowNewTask(false);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        status: "Pending",
        "assignedUsers": [userDeets._id],
        assignedTags: [],
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box px={8} py={24} mx="auto" minHeight="100vh" bg="brand.50">
      <VStack spacing={8} alignItems="center">
        {/* User Details */}
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
              onClick={handleShowNewTask}
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
  {tasks.map((task) => (
    <Box
      key={task._id}
      bg="brand.100" // Use a lighter background color
      rounded="md" // Use a slightly larger border radius
      shadow="md" // Use a smaller shadow size
      p={6} // Increase the padding to make the cards bigger
      borderWidth={1}
      borderColor="gray.200"
    >
      <Flex justifyContent="space-between" mb={4}> 
        <Text fontSize="2xl" fontWeight="bold"> 
          {task.title}
        </Text>
        <IconButton
          icon={<FiTrash2 />}
          size="sm"
          variant="outline"
          onClick={() => handleDeleteTask(task._id)}
        />
      </Flex>
      <Text mb={6}>{task.description}</Text>
      <Flex alignItems="center">
        <Checkbox
          isChecked={task.status === "Completed"}
          onChange={(e) =>
            handleCompleteTask(task._id, e.target.checked)
          }
        >
          <Text
            ml={2}
            fontWeight="bold"
            color={
              task.status === "Completed"
                ? "green.500"
                : "gray.600"
            }
          >
            {task.status}
          </Text>
        </Checkbox>
      </Flex>
    </Box>
  ))}
</SimpleGrid>
        </GridItem>
      </VStack>
    </Box>
  );
};

export default Profile;