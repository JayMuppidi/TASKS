
import * as d3 from "d3";
import React, { useEffect,useRef } from "react";
import {Box} from "@chakra-ui/react";
export function BarChart  ({ data }) {
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
  
      // Specify the chart's dimensions and margins
      const width = 400;
      const height = 250;
      const marginTop = 20;
      const marginRight = 0;
      const marginBottom = 30;
      const marginLeft = 40;
  
      // Create the x (horizontal position) scale and the corresponding axis generator
      const x = d3
        .scaleBand()
        .domain(tagData.map((d) => d.label))
        .range([marginLeft, width - marginRight])
        .padding(0.1);
  
      const xAxis = d3.axisBottom(x).tickSizeOuter(0);
  
      // Create the y (vertical position) scale and the corresponding axis generator
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(tagData, (d) => d.value)])
        .nice()
        .range([height - marginBottom, marginTop]);
  
      const yAxis = d3.axisLeft(y).ticks(5).tickFormat((d) => (Number.isInteger(d) ? d : ""));
  
      // Create the color scale for the bars
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  
      // Create the SVG container
      const svg = d3
        .create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr(
          "style",
          `max-width: ${width}px; height: auto; font: 10px sans-serif; overflow: visible;`
        );
  
      // Create a group for the bars
      const bars = svg.append("g");
  
      // Create the bars
      bars
        .selectAll("rect")
        .data(tagData)
        .join("rect")
        .attr("x", (d) => x(d.label))
        .attr("y", (d) => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => y(0) - y(d.value))
        .attr("fill", (d, i) => colorScale(i)) // Assign unique color to each bar
        .style("mix-blend-mode", "multiply"); // Darker color when bars overlap during the transition
  
      // Create the x-axis
      svg
        .append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);
  
      // Create the y-axis
      svg
        .append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call((g) => g.select(".domain").remove())
        .call((g) => g.selectAll(".tick:not(:first-of-type) line").remove());
  
      // Append the SVG to the container
      container.node().appendChild(svg.node());
  
      // Clean up the SVG on component unmount
      return () => {
        svg.remove();
      };
    }, [data]);
  
    return (
      <Box width="400px" height="400px" marginTop={5} p={5}>
        <div ref={chartRef} />
      </Box>
    );
  };
  
  
  
  
  export function DonutChart ({ data })  {
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
  
      // Specify the chart's dimensions
      const width = 600;
      const height = 800;
  
      // Create the color scale
      const color = d3.scaleOrdinal().domain(donutData.map((d) => d.label))
        .range(d3.quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), donutData.length).reverse());
  
      // Create the pie layout and arc generator
      const pie = d3.pie().sort(null).value((d) => d.value);
  
      const arc = d3.arc().innerRadius(70).outerRadius(Math.min(width, height) / 2 - 1).cornerRadius(10);
  
      // Create the SVG container
      const svg = d3
        .create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; font: 32px sans-serif;");
  
      // Add a sector path for each value
      svg
        .append("g")
        .attr("stroke", "white")
        .selectAll("path")
        .data(pie(donutData))
        .join("path")
        .attr("fill", (d) => color(d.data.label))
        .attr("d", arc)
        .append("title")
        .text((d) => `${d.data.label}: ${d.data.value.toLocaleString("en-US")}`);
  
      // Create a new arc generator to place a label close to the edge
      // The label shows the value if there is enough room
      svg
        .append("g")
        .attr("text-anchor", "middle")
        .selectAll()
        .data(pie(donutData))
        .join("text")
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .call((text) =>
          text
            .append("tspan")
            .attr("y", "-0.4em")
            .attr("font-weight", "bold")
            .text((d) => d.data.label)
        )
        .call((text) =>
          text
            .filter((d) => d.endAngle - d.startAngle > 0.25)
            .append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text((d) => d.data.value.toLocaleString("en-US"))
        );
  
      // Append the SVG to the container
      container.node().appendChild(svg.node());
  
      // Clean up the SVG on component unmount
      return () => {
        svg.remove();
      };
    }, [data]);
  
    return (
      <Box width="300px" height="300px" p={4}>
        <div ref={chartRef} />
      </Box>
    );
  };