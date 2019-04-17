var cityname = window.location.search.substr(6);
if(cityname != "") {
	// First chart: annual_consume
  // Canvas
  var margin = {
    top: 60,
    right: 80,
    bottom:60,
    left: 80
  }

  var width = 1000;
  var height = 250;

  var svg1 = d3.select("body")
               .append("svg")
                 .attr("width", margin.left + margin.right + width)
                 .attr("height", margin.top + margin.bottom + height)
               .append("g")
                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
  // Visualization of first chart
  function consume_chart(data, initial, current_year, energy_type) {
	
	  // Define the scales 
    var x_Scale = d3.scale.ordinal()
                    .rangeRoundBands([0, width], 0.3)
                    .domain(data.map(function(d) { return d.years;}));
                  
    var y_Scale = d3.scale.linear()
                    .range([height, 20])
                    .domain([0, d3.max(data, function(d) { return d.consume;})]);
                  
    // Learnt from the source: https://bost.ocks.org/mike/bar/3/
    // Add axes for the plot
    var x_Axis = d3.svg.axis()
                   .scale(x_Scale)
                   .orient("bottom");

    var y_Axis = d3.svg.axis()
                   .scale(y_Scale)
                   .orient("left");
                 
    // Learn from the source: http://bl.ocks.org/Caged/6476579
    // Add retrieve interactivity
    var retriever = d3.tip()
                      .attr('class', 'd3Tip')
                      .offset([-15, 0])
                      .html(function(d) { return "<strong>Annual Consume:</strong> <span style='color:black'>" + d.consume + "</span>";})

    svg1.call(retriever);
  
    // Draw data and show retrieve interactivity
    var Bar = svg1.selectAll("Bar")
                  .data(data)
                  .enter()
                  .append("rect")
                    .attr("class", "Bar")
                    .attr("x", function(d) { return x_Scale(d.years);})
                    .attr("width", x_Scale.rangeBand())
                    .attr("y", function(d) { return y_Scale(d.consume);})
                    .attr("height", function(d) { return height  - y_Scale(d.consume);})
                    .attr("fill", function(d) {
                         if(initial == 1 || d.years == current_year) {
                           if(d.company == "enexis") {
                             return "#0080FF";
                           } else if(d.company == "stedin") {
                           	 return "#02DF82";
                           } else {
                           	 return "#FF8000";
                           }
                         } else {
                           if(d.company == "enexis") {
                             return "#000079";
                           } else if(d.company == "stedin") {
                           	 return "#006030";
                           } else {
                           	 return "#844200";
                           }
                         }
                      })
                    .style("opacity", function(d) {
                    	   if(initial == 0 && d.years != current_year) {
                    	   	 return 0.3;
                    	   } else {
                    	   	 return 1;
                    	   }
                    })
                    .on('mouseover', retriever.show)
                    .on('mouseout', retriever.hide);
  
    // Add labels for the axes
    svg1.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + height + ")")
        .call(x_Axis)
        .append("text")
          .style("font-size", "18px")
          .attr("y", 40)
          .attr("x", 480)
          .text("Year");

    var y_label = svg1.append("g")
                        .attr("class", "yAxis")
                      .call(y_Axis)
                      .append("text")
                        .attr("transform", "rotate(-90)")
                        .style("font-size", "18px")
                        .attr("y", -65)
                        .attr("x", -240);
                        
    if(energy_type == "e") {
    	y_label = y_label.text("Annual Consume (k*kwh)");
    } else {
    	y_label = y_label.text(" Annual Consume (k*m3)");
    }
          

    // Add title for the plot
    svg1.append("text")
          .attr("class", "title")
          .style("font-size", "18px")
          .attr("y", -20)
          .attr("x", 340)
          .text("Annual Consume For ".concat(cityname.replace("%20", " ").replace("%27", "'")));
  }

  // Data source 
  d3.json("http://localhost:5000/e/".concat(cityname), function(consume_data) {
    consume_chart(consume_data, 1, 2010);
  })


  // Second chart: annual_low-tarif chart
  // Canvas
  var margin2 = {
    top: 60,
    right: 80,
    bottom:60,
    left: 80
  }

  var width2 = 400;
  var height2 = 250;
  var svg2 = d3.select("body")
               .append("svg")
                 .attr("width", margin2.left + margin2.right + width2)
                 .attr("height", margin2.top + margin2.bottom + height2)
               .append("g")
                 .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
               
  // Visualization of second chart
  function lowt_chart(data, energy_type) {
  	// Define the scales
    var x_Scale2 = d3.scale.ordinal()
                     .rangeRoundBands([0, width2], 0.3)
                     .domain(data.map(function(d) { return d.axis;}));

    var y_Scale2 = d3.scale.linear()
                     .range([height2, 20])
                     .domain([0, d3.max(data, function(d) { return d.freq;})]);
                   
    // Add axes for the plot
    var x_Axis2 = d3.svg.axis()
                    .scale(x_Scale2)
                    .orient("bottom");

    var y_Axis2 = d3.svg.axis()
                    .scale(y_Scale2)
                    .orient("left");
                  
    var retriever2 = d3.tip()
                       .attr('class', 'd3Tip')
                       .offset([-15, 0]);
                       
    if(energy_type == "e") {
    	retriever2.html(function(d) { return "<strong>Low-tarif frequency :</strong> <span style='color:black'>" + d.freq + "</span>";});
    } else {
    	retriever2.html(function(d) { return "<strong>Consume_per_connection frequency :</strong> <span style='color:black'>" + d.freq + "</span>";});
    }
                       
    svg2.call(retriever2);
  
    var Bar = svg2.selectAll("Bar")
                  .data(data)
                  .enter()
                  .append("rect")
                    .attr("class", "Bar")
                    .attr("x", function(d) { return x_Scale2(d.axis);})
                    .attr("width", x_Scale2.rangeBand())
                    .attr("y", function(d) { return y_Scale2(d.freq);})
                    .attr("height", function(d) { return height2  - y_Scale2(d.freq);})
                    .attr("fill", function(d) {
                     	  if(d.company == "enexis") {
                     	  	return "#0080FF";
                     	  } else if (d.company == "stedin") {
                     	  	return "#02DF82";
                     	  } else {
                     	  	return "#FF8000";
                     	  }
                    })
                    .on('mouseover', retriever2.show)
                    .on('mouseout', retriever2.hide);
                  
    // Add labels for the axes
    var x_label = svg2.append("g")
                        .attr("class", "xAxis")
                        .attr("transform", "translate(0," + height2 + ")")
                      .call(x_Axis2)
                      .append("text")
                        .style("font-size", "18px");

    svg2.append("g")
          .attr("class", "yAxis")
        .call(y_Axis2)
        .append("text")
          .attr("transform", "rotate(-90)")
          .style("font-size", "18px")
          .attr("y", -65)
          .attr("x", -180)
          .text("Frequency");

    // Add title for the plot
    var plot_title = svg2.append("text")
                           .attr("class", "title")
                           .style("font-size", "18px");
          
    if(energy_type == "e") {
      x_label = x_label.attr("y", 40)
                       .attr("x", 120)
                       .text("Low-tarif percentage");
      plot_title = plot_title.attr("y", -20)
                             .attr("x", 45)
                             .text("Histogram of Low-tarif Percentage");
    } else {
    	x_label = x_label.attr("y", 40)
                       .attr("x", 100)
                       .text("Consume per connection");
    	plot_title = plot_title.attr("y", -20)
                             .attr("x", -10)
                             .text("Histogram of Consume Per connection Percentage");
    }
  }

  // Data source 
  d3.json("http://localhost:5000/e/2010/".concat(cityname).concat("/l"), function(lowt_data) {
    lowt_chart(lowt_data, "e");
  })


  // Third chart: smartmeter chart
  // Canvas
  var margin3 = {
    top: 60,
    right: 80,
    bottom:60,
    left: 80
  }

  var width3 = 400;
  var height3 = 250;
  var svg3 = d3.select("body")
               .append("svg")
                 .attr("width", margin3.left + margin3.right + width3)
                 .attr("height", margin3.top + margin3.bottom + height3)
               .append("g")
                 .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");
               
  // Visualize Data
  function smartmeter_chart(data){
	  // Define the scales
    var x_Scale3 = d3.scale.ordinal()
                     .rangeRoundBands([0, width3], 0.3)
                     .domain(data.map(function(d) { return d.axis;}));

    var y_Scale3 = d3.scale.linear()
                     .range([height3, 20])
                     .domain([0, d3.max(data, function(d) { return d.freq;})]);
                   
    // Add axes for the plot
    var x_Axis3 = d3.svg.axis()
                    .scale(x_Scale3)
                    .orient("bottom");

    var y_Axis3 = d3.svg.axis()
                    .scale(y_Scale3)
                    .orient("left");

    var retriever3 = d3.tip()
                       .attr('class', 'd3Tip')
                       .offset([-15, 0])
                       .html(function(d) { return "<strong>Smart meter frequency:</strong> <span style='color:black'>" + d.freq + "</span>";})

    svg3.call(retriever3);
  
    var Bar = svg3.selectAll("Bar")
                  .data(data)
                  .enter()
                  .append("rect")
                    .attr("class", "Bar")
                    .attr("x", function(d) { return x_Scale3(d.axis);})
                    .attr("width", x_Scale3.rangeBand())
                    .attr("y", function(d) { return y_Scale3(d.freq);})
                    .attr("height", function(d) { return height3  - y_Scale3(d.freq);})
                    .attr("fill", function(d) {
                     	  if(d.company == "enexis") {
                     	  	return "#0080FF";
                     	  } else if (d.company == "stedin") {
                     	  	return "#02DF82";
                     	  } else {
                     	  	return "#FF8000";
                     	  }
                    })
                    .on('mouseover', retriever3.show)
                    .on('mouseout', retriever3.hide);

    // Add labels for the axes
    svg3.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + height3 + ")")
        .call(x_Axis3)
        .append("text")
          .style("font-size", "18px")
          .attr("y", 40)
          .attr("x", 120)
          .text("Smartmeter Percentage");

    svg3.append("g")
          .attr("class", "yAxis")
        .call(y_Axis3)
        .append("text")
          .attr("transform", "rotate(-90)")
          .style("font-size", "18px")
          .attr("y", -65)
          .attr("x", -180)
          .text("Frequency");

    // Add title for the plot
    svg3.append("text")
          .attr("class", "title")
          .style("font-size", "18px")
          .attr("y", -20)
          .attr("x", 45)
          .text("Histogram of Smartmeter Percentage");
  }

  // Data source 
  d3.json("http://localhost:5000/e/2010/".concat(cityname).concat("/s"), function(smartmeter_data) {
    smartmeter_chart(smartmeter_data);
  })
}

// Fourth chart: mean_LS chart
// Canvas
var margin4 = {
  top: 60,
  right: 80,
  bottom:60,
  left: 80
}

var width4 = 1000;
var height4 = 500;
             
var svg4 = d3.select("body")
             .append("svg")
               .attr("width", margin4.left + margin4.right + width4)
               .attr("height", margin4.top + margin4.bottom + height4)
             .append("g")
               .attr("transform", "translate(" + margin4.left + "," + margin4.top + ")");
               
// Visualize Data
function mean_LS_chart(data, energy_type) {
	
	// Define the scales
  var x_Scale4 = d3.scale.linear()
                   .range([0, width4])
                   .domain([-5, 105]);
                   
  var y_Scale4 = d3.scale.linear()
                   .range([height4, 20]);
  
  if(energy_type == "e") {
  	y_Scale4 = y_Scale4.domain([-5, 105]);
  } else {
  	y_Scale4 = y_Scale4.domain([-5, 405]);
  }

  // Add axes for the plot
  var x_Axis4 = d3.svg.axis()
                  .scale(x_Scale4)
                  .orient("bottom");

  var y_Axis4 = d3.svg.axis()
                  .scale(y_Scale4)
                  .orient("left");
               
  var retriever4 = d3.tip()
                     .attr('class', 'd3Tip')
                     .offset([-15, 0])
                     
  if(energy_type == "e") {
    retriever4 = retriever4.html(function(d) { return "<strong>City:</strong> <span style='color:black'>" + d.city + 
                     	                                "</span><br/>Low-tarif:</strong> <span style='color:black'>" + d.lp + 
                     	                                "%</span><br/>Smartmeter:</strong> <span style='color:black'>" + d.sp + 
                     	                                "%</span>";});
  } else {
    retriever4 = retriever4.html(function(d) { return "<strong>City:</strong> <span style='color:black'>" + d.city + 
                     	                                "</span><br/>Consume per conn:</strong> <span style='color:black'>" + d.lp + 
                     	                                "</span><br/>Smartmeter:</strong> <span style='color:black'>" + d.sp + 
                     	                                "%</span>";});
  }
                   
  svg4.call(retriever4); 
 
  var circle = svg4.selectAll("circle")
                   .data(data)
                   .enter()
                   .append("circle")
                     .attr("class", "circle")
                     .attr("cx", function(d) { return x_Scale4(d.sp);})
                     .attr("cy", function(d) { return y_Scale4(d.lp);})
                     .attr("r", function(d) { return d.c;})
                     .attr("fill", function(d) {
                     	  if(d.company == "enexis") {
                     	  	return "#0080FF";
                     	  } else if (d.company == "stedin") {
                     	  	return "#02DF82";
                     	  } else {
                     	  	return "#FF8000";
                     	  }
                     })
                     .style("opacity", 0.5)
                     .style("cursor", "pointer")
                     .on("mouseover", retriever4.show)
                     .on("mouseout", retriever4.hide)
                     .on("click", function(d) { window.location.href = "page2.html?city=".concat(d.city)});
                     
  // Add labels for the axes
  svg4.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + height4 + ")")
      .call(x_Axis4)
      .append("text")
        .style("font-size", "18px")
        .attr("y", 50)
        .attr("x", 360)
        .text("Mean Smartmeter Percentage");

  var y_label4 = svg4.append("g")
                       .attr("class", "yAxis")
                     .call(y_Axis4)
                     .append("text")
                       .attr("transform", "rotate(-90)")
                       .style("font-size", "18px");
        
  // Add title for the plot
  var plot_title4 = svg4.append("text")
                          .attr("class", "title")
                          .style("font-size", "18px");
                           
  if(energy_type == "e") {
  	y_label4 = y_label4.attr("y", -65)
  	                   .attr("x", -350)
  	                   .text("Mean Low-tarif Percentage");
  	plot_title4 = plot_title4.attr("y", -20)
  	                         .attr("x", 340)
  	                         .text("Mean Smartmeter-Lowtarif per city"); 
  } else {
  	y_label4 = y_label4.attr("y", -65)
  	                   .attr("x", -450)
  	                   .text("Mean Consume Per Connection Percentage");
  	plot_title4 = plot_title4.attr("y", -20)
  	                         .attr("x", 300)
  	                         .text("Mean Consume_per_conn-Lowtarif per city"); 	
  }
        
  // Add legend
  var color = [];
  if(energy_type == "e") {
    color = [{"company": "enexis", "color": "#0080FF", "r": 10, "type":"e"},
             {"company": "stedin", "color": "#02DF82", "r": 10, "type":"e"},
             {"company": "liander", "color": "#FF8000", "r": 10, "type":"e"},
             {"company": "N", "size": "1.249 k*kwh", "color": "#5B5B5B", "r": 2, "type":"e"},
             {"company": "N", "size": "27915 k*kwh", "color": "#5B5B5B", "r": 11, "type":"e"},
             {"company": "N", "size": "55832 k*kwh", "color": "#5B5B5B", "r": 20, "type":"e"}];
  } else {
  	color = [{"company": "enexis", "color": "#0080FF", "r": 10, "type":"g"},
             {"company": "stedin", "color": "#02DF82", "r": 10, "type":"g"},
             {"company": "liander", "color": "#FF8000", "r": 10, "type":"g"},
             {"company": "N", "size": "0.818 k*m3", "color": "#5B5B5B", "r": 2, "type":"g"},
             {"company": "N", "size": "10354 k*m3", "color": "#5B5B5B", "r": 11, "type":"g"},
             {"company": "N", "size": "20709 k*m3", "color": "#5B5B5B", "r": 20, "type":"g"}];
  }

               
  var legend = svg4.selectAll(".legend")
                   .data(color)
                   .enter()
                   .append("g")
                     .attr("class", "legend")
                     .attr("transform", function(d,i) {return "translate(0," + i * 35 +")";});
                     
  legend.append("circle")
          .attr("cx", width4 - 10)
          .attr("cy", function(d) {
            if(d.type == "e") {
            	return 290;
            } else {
            	return 30;
            }
          })
          .attr("r", function(d) { return d.r;})
          .style("fill", function(d) { return d.color;})
          .style("opacity", 0.7);   
  
  legend.append("text")
          .attr("x", width4 - 30)
          .attr("y", function(d) {
          	if(d.type == "e") {
          		return 295;
          	} else {
          		return 35;
          	}
          })
          .style("text-anchor", "end")
          .text(function(d) { 
            if(d.company.charAt(0) != "N") {
          	  return d.company.charAt(0).toUpperCase().concat(d.company.slice(1));
          	} else {
          	  return d.size;
          	}});
  
}

// Data source
d3.json("http://localhost:5000/mean/e/2010", function(mean_LS_data) {
	mean_LS_chart(mean_LS_data, "e");
})

function updateChangeInput() {
	  var val = document.getElementById("slider").value;
	  var radioList = document.getElementsByName("energy_type");
	  var energy_type = "e";
		  for(var i=0; i<radioList.length; i++){
			  if(radioList[i].checked){
				  energy_type = radioList[i].value.charAt(0);
			}
		}
		
    d3.selectAll(".Bar").remove();
    d3.selectAll(".circle").remove();
    d3.selectAll(".xAxis").remove();
    d3.selectAll(".yAxis").remove();
    d3.selectAll(".title").remove();
    d3.selectAll(".legend").remove();
    if(cityname != "") {
      d3.json("http://localhost:5000/".concat(energy_type).concat("/").concat(cityname), function(consume_data) {
        consume_chart(consume_data, 0, val, energy_type);
      })
    
      d3.json("http://localhost:5000/".concat(energy_type).concat("/").concat(val).concat("/").concat(cityname).concat("/l"), function(lowt_data) {
        lowt_chart(lowt_data, energy_type);
      })

      d3.json("http://localhost:5000/".concat(energy_type).concat("/").concat(val).concat("/").concat(cityname).concat("/s"), function(smartmeter_data) {
        smartmeter_chart(smartmeter_data);
      })
    }
    d3.json("http://localhost:5000/mean/".concat(energy_type).concat("/").concat(val), function(mean_LS_data) {
      mean_LS_chart(mean_LS_data, energy_type);
    })
}


function load() {
	window.location.href = "index.html";
}