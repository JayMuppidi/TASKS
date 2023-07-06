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
  Checkbox,
  Stack,
  Select,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import { FiTrash2, FiFilter, FiPlusCircle } from "react-icons/fi";

const Profile = () => {
  const [userTok, setUserTok] = useState();
  const [userDeets, setUserDeets] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    tags: "",
    assignedUsers: "",
    dueDate: "",
  });
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
          const reply = await api.get("api/user/" + userTok.user.id);
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
        const reply = await api.get("/tasks");
        setTasks(reply.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchTasks();
  }, []);

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.log(error);
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

  const filteredTasks = tasks.filter((task) => {
    const { status, tags, assignedUsers, dueDate } = filters;

    if (status && task.status !== status) {
      return false;
    }

    if (tags && !task.assignedTags.includes(tags)) {
      return false;
    }

    if (assignedUsers && !task.assignedUsers.includes(assignedUsers)) {
      return false;
    }

    if (dueDate && new Date(task.dueDate) > new Date(dueDate)) {
      return false;
    }

    return true;
  });

  const handleShowNewTask = () => {
    setShowNewTask(!showNewTask);
  };

 
  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async () => {
    try {
      const response = await api.post("/tasks", newTask);
      setTasks([...tasks, response.data]);
      setShowNewTask(false);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        status: "Pending",
        assignedUsers: [],
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
          <chakra.h1
            mb={4}
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
            color="brand.800"
          >
            User Details
          </chakra.h1>
          {userDeets && (
            <VStack spacing={2} alignItems="flex-start">
              <Text fontSize="xl" fontWeight="bold">
                Full Name: {userDeets.fName} {userDeets.lName}
              </Text>
              <Text fontSize="xl" fontWeight="bold">
                Email: {userDeets.email}
              </Text>
              <Text fontSize="xl" fontWeight="bold">
                Admin: {userDeets.isAdmin ? "Yes" : "No"}
              </Text>
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
            color="brand.800"
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
              New Task
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
            {filteredTasks.map((task) => (
              <Box
                key={task._id}
                bg="brand.800"
                rounded="lg"
                shadow="lg"
                p={4}
                borderWidth={1}
                borderColor="gray.200"
              >
                <Flex justifyContent="space-between" mb={2}>
                  <Text fontSize="xl" fontWeight="bold">
                    {task.title}
                  </Text>
                  <IconButton
                    icon={<FiTrash2 />}
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteTask(task._id)}
                  />
                </Flex>
                <Text mb={4}>{task.description}</Text>
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