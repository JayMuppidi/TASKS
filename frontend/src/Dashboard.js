import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import api from "./components/api";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("completion");
  const [userTok, setUserTok] = useState();
  const [userDeets, setUserDeets] = useState();
  const navigate = useNavigate();

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
          const response = await api.get(`tasks`);
          setTasks(response.data);
          updateCharts(response.data);
        } catch (error) {
          console.log(error);
        }
      }
      fetchTasks();
    }
  }, [userDeets]);

  const updateCharts = (data) => {
    // Update the charts based on the selected filter
    updateBarChart(data);
    updatePieChart(data);
  };

  const updateBarChart = (data) => {
    // Clear the existing bar chart
    d3.select("#bar-chart").selectAll("*").remove();

    // Create a new bar chart using D3.js
    // ...
  };

  const updatePieChart = (data) => {
    // Clear the existing pie chart
    d3.select("#pie-chart").selectAll("*").remove();

    // Create a new pie chart using D3.js
    // ...
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    // Update the charts with new filter
    updateCharts(tasks);
  };

  if (userDeets && userDeets.isAdmin) {
    return (
      <Flex direction="column" align="center" justify="center" p={8}>
        <Box id="bar-chart" w="100%" h="300px" mb={8} />
        <Box id="pie-chart" w="100%" h="300px" mb={8} />
        <Flex justify="center" mb={4}>
          <Button
            onClick={() => handleFilterChange("completion")}
            colorScheme={selectedFilter === "completion" ? "brand" : "gray"}
            mr={2}
          >
            Sort by Completion
          </Button>
          <Button
            onClick={() => handleFilterChange("tag")}
            colorScheme={selectedFilter === "tag" ? "brand" : "gray"}
            mr={2}
          >
            Sort by Tag
          </Button>
          <Button
            onClick={() => handleFilterChange("assignedUser")}
            colorScheme={selectedFilter === "assignedUser" ? "brand" : "gray"}
          >
            Sort by Assigned User
          </Button>
        </Flex>
      </Flex>
    );
  } else {
    return (
      <Flex direction="column" align="center" justify="center" p={8}>
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