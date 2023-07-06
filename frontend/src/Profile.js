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
} from "@chakra-ui/react";
import { FiTrash2, FiFilter } from "react-icons/fi";

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
  console.log(userDeets.fName)
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
            color="brand.800"
          >
            User Details
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
          )} </chakra.h1>
        </GridItem>

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
          <Flex align="center" mb={4}>
            <Text fontSize="lg" fontWeight="bold" mr={2}>
              Filter by:
            </Text>
            <IconButton
              icon={<FiFilter />}
              size="sm"
              variant="outline"
              onClick={() => setFilters({})}
            />
            <Select
              placeholder="Status"
              ml={2}
              w="200px"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="working">Working</option>
              <option value="Completed">Completed</option>
            </Select>
            {/* Add more filter options based on your schema */}
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {filteredTasks.map((task) => (
              <Box
                key={task._id}
                bg="white"
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