import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  chakra,
  Input,
  Heading,
  Text,
  useToast,
  Select
} from "@chakra-ui/react";
import api from "./components/api";
import {toaster,fetchTags,fetchAllTasks, renderAdminTasks} from "./components/helpers"
import {BarChart,DonutChart} from "./components/d3graphs"
import { FiPlusCircle } from "react-icons/fi";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [userDeets, setUserDeets] = useState();
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const toast = useToast();
  const [showNewTask, setShowNewTask] = useState(false);
  const [showNewTag, setShowNewTag] = useState(false);
  const [showGraphs, setShowGraphs] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
    assignedUsers: [],
    assignedTags: [],
  });
  const [newTag, setNewTag] = useState({
    name: "",
  });
  

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };
  
  const handleInputChangeTag = (e) => {
    setNewTag({ ...newTag, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async () => {
    try {
      newTask.assignedUsers=[userDeets._id];
      const response = await api.put("/tasks/", newTask);
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
  
  async function fetchUserDetails(userTok) {
    try {
      const response = await api.get(`user/${userTok.user.id}`);
      setUserDeets(response.data.user);
    } catch (error){
      console.log(error);
      navigate("/");
    }
  }
  const fetchUsers = async () => {
    try {
      const response = await api.get("/user/allUsers");
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case "status":
        setSelectedStatus(value);
        break;
      case "tag":
        setSelectedTag(value);
        break;
      case "user":
        setSelectedUser(value);
        break;
      default:
        break;
    }
  };
 
  // Check if user is logged in
  useEffect(() => {
    const authTok = localStorage.getItem("authTok");
    if (!authTok) {
      navigate("/");
    } else {
      fetchUserDetails(jwtDecode(authTok));
    }
  }, [navigate]);

  // Fetch tasks and create charts for admin users
  useEffect(() => {
    if (userDeets && userDeets.isAdmin) {
      fetchTags(setTags);
      fetchAllTasks(setTasks);
      fetchUsers();
    }
  }, [userDeets]);
/////////////////////////////////////////////////////
  //////??//////////////////////////////////////////
  // For adding a user or a tag, or creating a tag


  const handleCreateTag = async (taskId) => {
    try {
      await api.put("/tags/", newTag);
      setShowNewTag(false);
      setNewTag({ name: "" });
     toaster("Tag has been sucessfully created",1,toast)
    } catch (error) {toaster( "An error occurred while creating the tag.",0,toast)}
  };

  if (userDeets && userDeets.isAdmin) {
    return (
      <Flex direction="column" align="center" height="100vh" p={8} bg="brand.700">
        <Flex justifyContent="flex-end" mb={4}>
        <Button
            leftIcon={<FiPlusCircle />}
            colorScheme="brand"
            variant="solid"
            size="md"
            onClick={() => setShowGraphs(!showGraphs)}
          >
          {!showGraphs ? "Show graphs" : "Hide graphs"}
          </Button>
          {showGraphs && (
      <Flex justify="center" mt={4}>
        <Box width="400px" height="300px">
          <BarChart data={tasks} />
        </Box>
        <Box width="400px" height="300px">
          <DonutChart data={tasks} />
        </Box>
      </Flex>)}
            </Flex> 
          {! showGraphs && 
          <div>
          <Flex>
          <Button
            ml = {4}
            leftIcon={<FiPlusCircle />}
            colorScheme="brand"
            variant="solid"
            size="md"
            onClick={() => setShowNewTask(!showNewTask)}
          >
            {!showNewTask ? "New Task" : "Cancel new task"}
          </Button>
          <Button
            ml={4}
            colorScheme="brand"
            variant="solid"
            size="md"
            onClick={() => setShowNewTag(!showNewTag)}
          >
            {!showNewTag ? "New Tag" : "Cancel new tag"}
          </Button>
        </Flex>
        
        {showNewTag && (
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
              Create New Tag
            </chakra.h2>
            <FormControl id="Name" mb={4}>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                name="name"
                textColor={""}
                value={newTag.name}
                onChange={handleInputChangeTag}
              />
            </FormControl>
            <Button
              colorScheme="brand"
              variant="solid"
              size="sm"
              onClick={handleCreateTag}
            >
              Create Tag
            </Button>
          </Box>
        )}
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
        )}  </div>}

        {!showGraphs&&<Flex wrap="wrap" justify="center" maxW="800px">
        <FormControl mx={2}>
          <FormLabel>Status</FormLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </Select>
        </FormControl>

        <FormControl mx={2}>
          <FormLabel>Tag</FormLabel>
          <Select
            value={selectedTag}
            onChange={(e) => handleFilterChange("tag", e.target.value)}
          >
            <option value="">All</option>
            {tags.map((tag) => (
              <option key={tag._id} value={tag._id}>
                {tag.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl mx={2}>
          <FormLabel>User</FormLabel>
          <Select
            value={selectedUser}
            onChange={(e) => handleFilterChange("user", e.target.value)}
          >
            <option value="">All</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.fName}
              </option>
            ))}
          </Select>
        </FormControl>
      </Flex>}
          {!showGraphs&& renderAdminTasks(tasks,users,tags,toast,setTasks,selectedStatus,selectedTag,selectedUser)}
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