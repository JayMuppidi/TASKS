import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Box, Button,HStack, Flex,FormControl,FormLabel,chakra,Input, Heading, Text, useToast } from "@chakra-ui/react";
import api from "./components/api";
import { FiPlusCircle } from "react-icons/fi";
const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("completion");
  const [userTok, setUserTok] = useState();
  const [userDeets, setUserDeets] = useState();
  const navigate = useNavigate();
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
  const handleCompleteTask = async (taskId, checked) => {
    try {
      await api.put(`/tasks/updateStatus/${taskId}`, {
        status: checked ? "Completed" : "Pending",
      });
    } catch (error) {
      console.log(error);
    }
  };


  const formatDate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US");
    return formattedDate;
  };
  const handleShowNewTask = () => {
    setShowNewTask(!showNewTask);
  };

  // Check if user is logged in
  useEffect(() => {
    const authTok = localStorage.getItem("authTok");
    if (!authTok) {
      navigate("/");
    } else {
      setUserTok(jwtDecode(authTok));
    }
  }, [navigate]);

  // Fetch user details
  useEffect(() => {
    if (userTok) {
      async function fetchUserDetails() {
        try {
          const response = await api.get(`user/${userTok.user.id}`);
          setUserDeets(response.data.user);
        } catch (error) {
          console.log(error);
          navigate("/");
        }
      }
      fetchUserDetails();
    }
  }, [userTok]);

  // Fetch tasks and create charts for admin users
  useEffect(() => {
    if (userDeets && userDeets.isAdmin) {
      async function fetchTasks() {
        try {
          const response = await api.get("/tasks/allTasks");
          setTasks(response.data);
          console.log(response.data)
          updateCharts(response.data);
        } catch (error) {
          console.log(error);
        }
      }
      fetchTasks();
    }
  }, [userDeets]);

  const updateCharts = (data) => {
    updateBarChart(data);
    updatePieChart(data);
  };

  const updateBarChart = (data) => {
    d3.select("#bar-chart").selectAll("*").remove();
    // Create a new bar chart using D3.js
    // ...
  };

  const updatePieChart = (data) => {
    d3.select("#pie-chart").selectAll("*").remove();
    // Create a new pie chart using D3.js
    // ...
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    updateCharts(tasks);
  };

  const addUserToTask = (taskId) => {
    // Logic to add user to task
    // ...
    toast({
      title: "User added to task",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const addTagToTask = (taskId) => {
    // Logic to add tag to task
    // ...
    toast({
      title: "Tag added to task",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const addTag = () => {
    // Logic to add a new tag
    // ...
    toast({
      title: "Tag added",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const markTaskComplete = (taskId) => {
    // Logic to mark task as complete
    // ...
    toast({
      title: "Task marked as complete",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const deleteTask = (taskId) => {
    // Logic to delete task
    // ...
    toast({
      title: "Task deleted",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  if (userDeets && userDeets.isAdmin) {
    return (
      
      <Flex direction="column" align="center" height="100vh"p={8} bg="brand.700">
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
              bg="brand.300"
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


        {/* <Box id="bar-chart" w="100%" h="300px" mb={8} />
        <Box id="pie-chart" w="100%" h="300px" mb={8} /> */}
        <Flex justify="center"  marginTop={3}  mb={4}>
          <Button
            onClick={() => handleFilterChange("completion")}
            colorScheme={selectedFilter === "completion" ? "brand" : "gray"}
            mr={2}
            _hover={{ bg: "brand.50" }}
          >
            Sort by Completion
          </Button>
          <Button
            onClick={() => handleFilterChange("tag")}
            colorScheme={selectedFilter === "tag" ? "brand" : "gray"}
            mr={2}
            _hover={{ bg: "brand.50" }}
          >
            Sort by Tag
          </Button>
          <Button
            onClick={() => handleFilterChange("assignedUser")}
            colorScheme={selectedFilter === "assignedUser" ? "brand" : "gray"}
            _hover={{ bg: "brand.50" }}
          >
            Sort by Assigned User
          </Button>
        </Flex>
        <Flex wrap="wrap" justify="center" maxW="800px">
        {tasks.map((task) => (
  <Box
    key={task.id}
    bg="white"
    p={4}
    m={2}
    borderRadius="md"
    boxShadow="md"
    width="600px"
    _hover={{ bg: "brand.50" }}
    textAlign="center"
  >
    <Box mb={4} bg="brand.500" p={2} borderRadius="md">
      <Heading size="md">{task.title}</Heading>
    </Box>
    <Text mb={2} fontSize="sm" color="gray.500">
      Status: {task.status}
    </Text>
    {task.assignedTags.length > 0 && (
      <Text mb={2} fontSize="sm" color="gray.500">
        Tags: {task.assignedTags.join(", ")}
      </Text>
    )}
    {task.assignedUsers.length > 0 && (
      <Text mb={2} fontSize="sm" color="gray.500">
        Assigned Users: {task.assignedUsernames.join(", ")}
      </Text>
    )}
    <Text mb={2}>Due by: {formatDate(task.dueDate)}</Text>
    <HStack justify="space-between" mt="auto">
      <Button flex={1} size="sm" onClick={() => addUserToTask(task.id)}>
        Add User
      </Button>
      <Button flex={1} size="sm" onClick={() => addTagToTask(task.id)}>
        Add Tag
      </Button>
      <Button flex={1} size="sm" onClick={() => markTaskComplete(task.id)}>
        Mark as Complete
      </Button>
      <Button flex={1} size="sm" onClick={() => deleteTask(task.id)}>
        Delete
      </Button>
    </HStack>
  </Box>
))}
</Flex>
      </Flex>
    );
  } else {
    return (
      <Flex direction="column" align="center" justify="center" p={8} bg="brand.300">
        <Heading mb={4}>Non-Admin User</Heading>
        <Text>You are not authorized to view this page.</Text>
        <Button mt={4} onClick={() => navigate("/")}>
          Go Back
        </Button>
      </Flex>
    );
  }
};

export default Dashboard;