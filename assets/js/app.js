// @TODO: YOUR CODE HERE!
// Store width and height parameters to be used in later in the canvas

function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");

    // clear svg is not empty
    if (!svgArea.empty()) {
    svgArea.remove();
    }

    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;    

    // Set svg margins 
    var margin = {
      top: 200,
      bottom: 200,
      right: 200,
      left: 200
    };

    // Create the width and height based svg margins and parameters to fit chart group within the canvas
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create the canvas to append the SVG group that contains the states data
    // Give the canvas width and height calling the variables predifined.
    var svg = d3.select("#scatter")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    // Create the chartGroup that will contain the data
    // Use transform attribute to fit it within the canvas
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Read CSV
    d3.csv("assets/data/data.csv")
      .then(function(stateData) {

      // Parse data
      stateData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
        data.income = +data.income;
      });

      console.log(stateData);

      // Create scales
      var xLinearScale = d3.scaleLinear()
        .domain([20, d3.max(stateData, d => d.obesity) + 2])
        .range([0, width]);

      var yLinearScale = d3.scaleLinear()
        .domain([6, d3.max(stateData, d => d.poverty) + 2])
        .range([height, 0]);

      // Create axes
      var xAxis = d3.axisBottom(xLinearScale);
      var yAxis = d3.axisLeft(yLinearScale);

      // Append axes
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
      chartGroup.append("g")
        .call(yAxis);

      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left - 250)
        .attr("x", 0 - (height / 1.5))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("% of Population in Poverty");

      chartGroup.append("text")
        .attr("transform", `translate(${width / 2.5}, ${height + margin.top - 150})`)
        .attr("class", "axisText")
        .text("% of Population with Obesity");

      // Create Circles for scatter plot
      var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.obesity))
        .attr("cy", d => yLinearScale(d.poverty))
        .attr("r", d => d.income/2500)
        .attr("fill", "#1BC416")
        .attr("opacity", ".7")

      // Append text to circles 
      var circlesGroup = chartGroup.selectAll()
        .data(stateData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.obesity))
        .attr("y", d => yLinearScale(d.poverty))
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .style('fill', '#000000')
        .text(d => (d.abbr));

      // Tool tip
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
          return (`<strong>${d.state}<br>Avg Income: $${d.income}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}% `);
        });

      chartGroup.call(toolTip);

      circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
      })
        .on("mouseout", function (data) {
          toolTip.hide(data);
        });
    })
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
