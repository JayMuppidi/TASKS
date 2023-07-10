import React, { useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import {
  Box,
  Button,
  HStack,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  chakra,
  Input,
  Heading,
  Text,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import api from "./components/api";
import {toaster, BarChart, DonutChart} from "./components/helpers"
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
  
  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toaster("Task has been sucessfully deleted",1,toast);
    } catch (error) {
      console.log(error);
      toaster("An error occured while deleting the task",0,toast);
    }
  };
  
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

  const handleCompleteTask = async (taskId, checked) => {
    try {
      await api.put(`/tasks/updateStatus/${taskId}`, {
        status: checked ? "Completed" : "Pending",
      });
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };
  
  const fetchTags = async () => {
    try {
      const response = await api.get("/tags/allTags");
      setTags(response.data);
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
      console.log(response.data)
      setUsers(response.data);
    } catch (error) {
      console.log(error);
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

  async function fetchTasks() {
    try {
      const response = await api.get("/tasks/allTasks");
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  // Fetch tasks and create charts for admin users
  useEffect(() => {
    if (userDeets && userDeets.isAdmin) {
      fetchTags();
      fetchTasks();
      fetchUsers();
    }
  }, [userDeets]);
/////////////////////////////////////////////////////
  //////??//////////////////////////////////////////
  // For adding a user or a tag, or creating a tag


  const handleAddUser = async (userId,taskId) => {
    try{
        await api.put("/tasks/addUser",{"userId":userId,"taskId":taskId});
        toaster("User added to task",1,toast)
      fetchTasks();
    }
    catch {toaster(" There was an issue adding the user",0,toast)}
  };

  const handleAddTag = async (tagId,taskId) => {
    try{
        await api.put("/tasks/addTag",{"tagId":tagId,"taskId":taskId});
        toaster("Tag added to task",1,toast)
      fetchTasks();
    }
    catch{toaster(" There was an issue adding the tag",0,toast)}
  };

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
          {!showGraphs&& 
                  <Flex wrap="wrap" justify="center" maxW="800px">
          {tasks.map((task) => (
            <Box
              key={task._id}
              bg="brand.500"
              p={4}
              m={2}
              borderRadius="md"
              boxShadow="md"
              width="600px"
              textAlign="center"
            >
              <Box mb={4} bg="brand.50" p={2} borderRadius="md">
                <Heading textColor = "brand.800" size="md">{task.title}</Heading>
              </Box>
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
                      task.status === "Completed" ? "green.500" : "gray.600"
                    }
                  >
                    {task.status}
                  </Text>
                </Checkbox>
              </Flex>
              {task.assignedTags.length > 0 && (
                <Text mb={2} fontSize="md" color="white">
                  Tags:{" "}
                  <Wrap>
                    {task.assignedTags.map((tag) => (
                      <WrapItem key={tag._id}>
                        <Text bg="brand.200" px={2} py={1} borderRadius="md">
                          {tag.name}
                        </Text>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Text>
              )}
              {task.assignedUsers.length > 0 && (
                <Text mb={2} fontSize="md" color="white">
                  Assigned Users:{" "}
                  <Wrap>
                    {task.assignedUsers.map((user) => (
                      <WrapItem key={user._id}>
                        <Text>{user.fName}</Text>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Text>
              )}
              <Text mb={2}>Due by: {new Date(task.dueDate).toLocaleDateString("en-US")}</Text>
              <HStack justify="space-between" mt="auto">
              <Menu>
              <MenuButton
                as={Button}
                flex={1}
                size="sm"
                colorScheme="brand"
                variant="outline"
              >
                Add User
              </MenuButton>
              <MenuList>
                {users.map((user) => (
                  <MenuItem
                    key={user._id}
                    onClick={() => handleAddUser(user._id,task._id)}
                  >
                    {user.fName}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            
            <Menu>
              <MenuButton
                as={Button}
                flex={1}
                size="sm"
                colorScheme="brand"
                variant="outline"
              >
                Add Tag
              </MenuButton>
              <MenuList>
                {tags.map((tag) => (
                  <MenuItem
                    key={tag._id}
                    onClick={() => handleAddTag(tag._id,task._id)}
                  >
                    {tag.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
                <Button
                  flex={1}
                  size="sm"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  Delete
                </Button>
              </HStack>
            </Box>
          ))}
        </Flex>}
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