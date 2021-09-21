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