import React, { useEffect, useState,useRef } from "react";
import * as d3 from "d3";
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
import { FiPlusCircle } from "react-icons/fi";

const BarChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const container = d3.select(chartRef.current);

    // Clear existing content
    container.selectAll("*").remove();

    // Count the number of tasks for each tag
    const tagCounts = {};
    data.forEach((task) => {
      task.assignedTags.forEach((tag) => {
        tagCounts[tag.name] = (tagCounts[tag.name] || 0) + 1;
      });
    });

    // Convert tagCounts to an array of objects
    const tagData = Object.entries(tagCounts).map(([label, value]) => ({
      label,
      value,
    }));

    // Define color scale for tags
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Calculate the bar height based on the tag values
    const barHeightScale = d3
      .scaleLinear()
      .domain([0, d3.max(tagData, (d) => d.value)])
      .range([0, 200]);

    // Create the bars
    container
      .selectAll("rect")
      .data(tagData)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 40 + 20)
      .attr("y", (d) => 200 - barHeightScale(d.value))
      .attr("width", 30)
      .attr("height", (d) => barHeightScale(d.value))
      .attr("fill", (d, i) => colorScale(i))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", d3.color(colorScale(d.label)).darker(0.2));
        container
          .append("text")
          .attr("x", event.pageX)
          .attr("y", event.pageY - 10)
          .attr("fill", "white")
          .attr("font-size", "14px")
          .attr("id", "tooltip")
          .text(`${d.label}: ${d.value}`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", (d, i) => colorScale(i));
        container.select("#tooltip").remove();
      });

    // Create the x-axis
    const xAxis = d3
      .axisBottom()
      .scale(
        d3
          .scaleBand()
          .domain(tagData.map((d) => d.label))
          .range([30, tagData.length * 40 + 10])
      );

    // Append a new SVG group for the x-axis
    const xAxisGroup = container
      .append("g")
      .attr("transform", "translate(0, 200)")
      .call(xAxis);

    // Style the x-axis labels
    xAxisGroup
  .selectAll("text")
  .attr("font-family", "Arial, sans-serif")
  .attr("font-size", "20px")
  .attr("fill", "#333")
  .attr("transform", "rotate(-45)")
  .style("text-anchor", "end")
  .attr("dy", "-0.5em")
  .attr("dx", "-0.5em")
  .attr("fill", "orange");

    // Add axis label
    container
      .append("text")
      .attr("x", -50)
      .attr("y", 220)
      .attr("font-family", "Arial, sans-serif")
      .attr("font-size", "16px")
      .attr("fill", "#333")
      .text("Tags");

    // Add title
    container
      .append("text")
      .attr("x", 200)
      .attr("y", -20)
      .attr("font-family", "Arial, sans-serif")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .attr("fill", "#333")
      .attr("text-anchor", "middle")
      .text("Tag Frequency");

    // Add chart border
    container
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 400)
      .attr("height", 250)
      .attr("fill", "none")
      .attr("stroke", "#ddd")
      .attr("stroke-width", 1);
  }, [data]);

  return (
    <Box width="400px" height="400px" p={4}>
      <svg ref={chartRef} width="100%" height="100%" />
    </Box>
  );
};


const DonutChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const container = d3.select(chartRef.current);

    // Clear existing content
    container.selectAll("*").remove();

    // Count the number of completed and pending tasks
    const completedCount = data.filter((task) => task.status === "Completed").length;
    const pendingCount = data.filter((task) => task.status === "Pending").length;

    // Create the donut chart data
    const donutData = [
      { label: "Completed", value: completedCount },
      { label: "Pending", value: pendingCount },
    ];

    // Set up the donut chart layout
    const pie = d3.pie().value((d) => d.value);

    // Generate the arc for each donut slice
    const arc = d3.arc().innerRadius(70).outerRadius(100).cornerRadius(10);

    // Create the donut slices
    const slices = container
      .selectAll("path")
      .data(pie(donutData))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => (i === 0 ? "#68D391" : "#ED8936"))
      .attr("transform", "translate(200, 200)");

    // Add percentages to the donut slices
    slices
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-family", "sans-serif")
      .attr("font-size", "14px")
      .text((d) => `${d.data.value} (${d3.format(".1%")(d.data.value / (completedCount + pendingCount))})`);

    // Create legend
    const legend = container
      .selectAll(".legend")
      .data(donutData)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(280, ${i * 30 + 20})`);

    // Add legend color rectangles
    legend
      .append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", (d, i) => (i === 0 ? "#68D391" : "#ED8936"));

    // Add legend text
    legend
      .append("text")
      .attr("x", 30)
      .attr("y", 15)
      .attr("fill", "black")
      .attr("font-family", "sans-serif")
      .attr("font-size", "14px")
      .text((d) => d.label);
  }, [data]);

  return (
    <Box width="400px" height="800px" p={4}>
      <svg ref={chartRef} width="100%" height="100%" />
    </Box>
  );
};



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
  const toaster = (message,flag) => {
    toast({
      title: message,
      status: (flag)?("success"):("error"),
      duration: 2000,
      isClosable: true,
    });
  }
 
  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toaster("Task has been sucessfully deleted",1);
    } catch (error) {
      console.log(error);
      toaster("An error occured while deleting the task",0);
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

  //helper function to clean up date display    
  


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
        toaster("User added to task",1)
      fetchTasks();
    }
    catch {toaster(" There was an issue adding the user",0)}
  };

  const handleAddTag = async (tagId,taskId) => {
    try{
        await api.put("/tasks/addTag",{"tagId":tagId,"taskId":taskId});
        toaster("Tag added to task",1)
      fetchTasks();
    }
    catch{toaster(" There was an issue adding the tag",0)}
  };

  const handleCreateTag = async (taskId) => {
    try {
      await api.put("/tags/", newTag);
      setShowNewTag(false);
      setNewTag({ name: "" });
     toaster("Tag has been sucessfully created",1)
    } catch (error) {toaster( "An error occurred while creating the tag.",0)}
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