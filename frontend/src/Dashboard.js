import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("completion");

  useEffect(() => {
    // Simulated data for tasks
    const taskData = [
      { id: 1, title: "Task 1", completion: 0.5, tag: "Tag A", assignedUser: "User 1" },
      { id: 2, title: "Task 2", completion: 0.8, tag: "Tag B", assignedUser: "User 2" },
      { id: 3, title: "Task 3", completion: 0.2, tag: "Tag A", assignedUser: "User 1" },
      { id: 4, title: "Task 4", completion: 0.6, tag: "Tag C", assignedUser: "User 3" },
    ];

    setTasks(taskData);
  }, []);

  useEffect(() => {
    // Update the chart when the selected filter changes
    updateChart();
  }, [selectedFilter]);

  const updateChart = () => {
    // Clear the existing chart
    d3.select("#chart").selectAll("*").remove();

    // Get the data based on the selected filter
    let data = [];
    switch (selectedFilter) {
      case "completion":
        data = tasks.sort((a, b) => b.completion - a.completion);
        break;
      case "tag":
        data = tasks.sort((a, b) => a.tag.localeCompare(b.tag));
        break;
      case "assignedUser":
        data = tasks.sort((a, b) => a.assignedUser.localeCompare(b.assignedUser));
        break;
      default:
        data = tasks;
    }

    // Create charts using D3.js
    createBarChart(data);
    createPieChart(data);
  };

  const createBarChart = (data) => {
    // Create a bar chart using D3.js
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.title))
      .padding(0.1);

    const y = d3.scaleLinear().range([height, 0]).domain([0, 1]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.title))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.completion))
      .attr("height", (d) => height - y(d.completion))
      .style("fill", "#623d86");

    // Add labels to the bars
    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.title) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.completion) - 10)
      .text((d) => `${(d.completion * 100).toFixed(0)}%`)
      .attr("text-anchor", "middle")
      .attr("fill", "white");

    // Add the selected filter label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .text(`Tasks sorted by ${selectedFilter}`)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold");
  };

  const createPieChart = (data) => {
    // Create a pie chart using D3.js
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value((d) => d.value);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = svg.selectAll("arc").data(pie(data)).enter().append("g");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i))
      .attr("stroke", "white")
      .style("stroke-width", "2px");

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text((d) => `${d.data.title} (${(d.data.completion * 100).toFixed(0)}%)`);

    // Add the selected filter label
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", -radius - 20)
      .text(`Tasks sorted by ${selectedFilter}`)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div id="chart"></div>
      <div>
        <button
          className="filter-button"
          data-filter="completion"
          style={{ marginRight: "10px" }}
          onClick={() => setSelectedFilter("completion")}
        >
          Sort by Completion
        </button>
        <button
          className="filter-button"
          data-filter="tag"
          style={{ marginRight: "10px" }}
          onClick={() => setSelectedFilter("tag")}
        >
          Sort by Tag
        </button>
        <button
          className="filter-button"
          data-filter="assignedUser"
          onClick={() => setSelectedFilter("assignedUser")}
        >
          Sort by Assigned User
       </button>
      </div>
    </div>
  );
};

export default Dashboard;
