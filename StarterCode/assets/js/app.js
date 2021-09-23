//  Updating x-scale const upon click on axis label with function
function xScale(csvData, chosenXAxis) {
  // create scales
  let xLinearScale = d3.scaleLinear()
    .domain([d3.min(csvData, d => d[XAxis]) * 0.9,
      d3.max(csvData, d => d[XAxis]) * 1.1
    ])
    .range([0, width]);

  return xLinearScale;
}

// Update y-scale const upon click on axis label using function
function yScale(csvData, YAxis) {
  // create scales
  let yLinearScale = d3.scaleLinear()
    .domain([d3.min(csvData, d => d[YAxis]) - 1,
      d3.max(csvData, d => d[YAxis]) + 1
    ])
    .range([height, 0]);

  return yLinearScale;
}

// Update xAxis const upon click on axis label using function
function renderXAxes(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// Updating yAxis const upon click on axis label using function
function renderYAxes(newYScale, yAxis) {
  let leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// functions used for updating circles group with a transition to
// Circles for both X and Y coordinates
function renderXCircles(circlesGroup, newXScale, Xaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[Xaxis]));

  return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, Yaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[YAxis]));

  return circlesGroup;
}

// functions used for updating circles text with a transition on
// new circles for both X and Y coordinates
function renderXText(circlesGroup, newXScale, Xaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[XAxis]));

  return circlesGroup;
}

function renderYText(circlesGroup, newYScale, Yaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("dy", d => newYScale(d[YAxis])+5);

  return circlesGroup;
}

// format number to USD currency
let formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// Update circles group with new tooltip with function
function updateToolTip(circlesGroup, XAxis, YAxis) {

  let xpercentsign = "";
  let xlabel = "";
  if (XAxis === "poverty") {
    xlabel = "Poverty";
    xpercentsign = "%";
  } else if (XAxis === "age"){
    xlabel = "Age";
  } else {
    xlabel = "Income";
  }

  let ypercentsign = "";
  let ylabel = "";
  if (YAxis === "healthcare") {
    ylabel = "Healthcare";
    ypercentsign = "%";
  } else if (YAxis === "smokes"){
    ylabel = "Smokes";
    ypercentsign = "%";
  } else {
    ylabel = "Obesity";
    ypercentsign = "%";
  }

  const toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([50, -75])
    .html(function(d) {
      if (XAxis === "income"){
        let incomelevel = formatter.format(d[XAxis]);

        return (`${d.state}<br>${xlabel}: ${incomelevel.substring(0, incomelevel.length-3)}${xpercentsign}<br>${ylabel}: ${d[YAxis]}${ypercentsign}`)
      } else {
        return (`${d.state}<br>${xlabel}: ${d[XAxis]}${xpercentsign}<br>${ylabel}: ${d[YAxis]}${ypercentsign}`)
      };
    });

  circlesGroup.call(toolTip);

  // mouseover 
  circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
      //  highlight chosen circle attempt
      // circlesGroup.append("circle")
      //   .attr("cx", d3.event.pageX)
      //   .attr("cy", d3.event.pageY)
      //   .attr("r", 15)
      //   .attr("stroke", "black")
      //   .attr("fill", "none");
  })
    // onmouseout event
    .on("mouseout", function(data) {
        toolTip.hide(data, this);
    });

return circlesGroup;
}
const svgWidth = 960;
const svgHeight = 500;

const margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Insert an SVG wrapper, append an SVG group that will hold our chart,
//  shift latter by top margin left.
const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight + 40); // extra padding for third label

// Append an SVG group
const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Param
let XAxis = "poverty";
let YAxis = "healthcare";

(async function(){

  // Import Data
  const stateData = await d3.csv("assets/data/data.csv");

  // Parse Data and Cast as numbers
  stateData.forEach(function(data) {
    data.poverty    = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age        = +data.age;
    data.smokes     = +data.smokes;
    data.obesity    = +data.obesity;
    data.income     = +data.income;
  });

  // Initialize scale functions
  let xLinearScale = xScale(stateData, XAxis);
  let yLinearScale = yScale(stateData, YAxis);

  // Axis functions intiialization
  let bottomAxis = d3.axisBottom(xLinearScale);
  let leftAxis = d3.axisLeft(yLinearScale);

  // Append x and y axes to the chart
  let xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  let yAxis = chartGroup.append("g")
    .call(leftAxis);

  // Makescatterplot and append initial circles
  let circlesGroup = chartGroup.selectAll("g circle")
    .data(stateData)
    .enter()
    .append("g");
  
  let circlesXY = circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d[XAxis]))
    .attr("cy", d => yLinearScale(d[YAxis]))
    .attr("r", 15)
    .classed("stateCircle", true);
  
  let circlesText = circlesGroup.append("text")
    .text(d => d.abbr)
    .attr("dx", d => xLinearScale(d[XAxis]))
    .attr("dy", d => yLinearScale(d[YAxis]) + 5)
    .classed("stateText", true);

  // Create group for 3 x-axis labels
  const xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height})`);

  const povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty") // value to fetch for event listener
    .text("In Poverty (%)")
    .classed("active", true);

  const ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "age") // value to fetch for event listener
    .text("Age (Median)")
    .classed("inactive", true);

  const incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 80)
    .attr("value", "income") // value to fetch for event listener
    .text("Household Income (Median)")
    .classed("inactive", true);

  // Create group for 3 y-axis labels
  const ylabelsGroup = chartGroup.append("g");

  const healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -40)
    .attr("value", "healthcare") // value to fetch for event listener
    .text("Lacks Healthcare (%)")
    .classed("active", true);

  const smokesLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("value", "smokes") // value to fetch for event listener
    .text("Smokes (%)")
    .classed("inactive", true);

  const obeseLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -80)
    .attr("value", "obesity") // value to fetch for event 
    .text("Obese (%)")
    .classed("inactive", true);

  //  tooltips
  circlesGroup = updateToolTip(circlesGroup, XAxis, YAxis);

  // x axis labels event 
  xlabelsGroup.selectAll("text")
    .on("click", function() {
    // Select value
    const value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

      // replaces XAxis with value
      XAxis = value;

      // updates x scale for new data
      xLinearScale = xScale(stateData, XAxis);

      // updates x axis with transition
      xAxis = renderXAxes(xLinearScale, xAxis);

      // updates circles with new x values
      circlesXY = renderXCircles(circlesXY, xLinearScale, XAxis);

      // updates circles text with new x values
      circlesText = renderXText(circlesText, xLinearScale, XAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(circlesGroup, XAxis, YAxis);

      //  change to bold text
      if (XAxis === "age") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (XAxis === "income") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", true)
          .classed("inactive", false);
      }
      else {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
    }
  });

  // y axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {
    // get value of selection
    const value = d3.select(this).attr("value");
    if (value !== YAxis) {

      // replaces chosenYAxis with value
      YAxis = value;

      // updates y scale for new data
      yLinearScale = yScale(stateData, YAxis);

      // updates y axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new y values
      circlesXY = renderYCircles(circlesXY, yLinearScale, YAxis);

      // updates circles text with new y values
      circlesText = renderYText(circlesText, yLinearScale, YAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(circlesGroup, XAxis, YAxis);

      // changes classes to change bold text
      if (YAxis === "smokes") {
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (YAxis === "obesity"){
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obeseLabel
          .classed("active", true)
          .classed("inactive", false);
      }
      else {
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
      }
    }
  });

})()