var margin = {
	top: 80, 
	right: 50, 
	bottom: 100, 
	left: 100};
	
function Matrix(options) {
	    var width = 400,
	    height = 400,
	    data = options.data,
	    container = options.container,
	    labelsData = options.labels,
	    startColor = options.start_color,
	    endColor = options.end_color;

	var widthLegend = 100;

  var maxValue = 1;
  var minValue = 0;

	var svg = d3.select("#container")
	            .append("svg")
	              .attr("class", "canvas")
	              .attr("width", width + margin.left + margin.right)
	              .attr("height", height + margin.top + margin.bottom)
		          .append("g")
	              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var background = svg.append("rect")
	                      .attr("class", "background")
	                      .attr("width", width)
	                      .attr("height", height)
	                      .style("stroke", "black")
	                      .style("stroke-width", "2px");

	var xScale = d3.scale.ordinal()
	               .rangeBands([0, width])
	               .domain(d3.range(5));

	var yScale = d3.scale.ordinal()
	               .rangeBands([0, height])
	               .domain(d3.range(5));

	var colorMap = d3.scale.linear()
	                 .range([startColor, endColor])
	                 .domain([minValue,maxValue]);

	var row = svg.selectAll(".row")
	             .data(data)
	  	         .enter()
	  	         .append("g")
	               .attr("class", "row")
	               .attr("transform", function(d, i) { return "translate(0," + yScale(i) + ")"; });

	var cell = row.selectAll(".cell")
	              .data(function(d) { return d; })
			          .enter()
			          .append("g")
	                .attr("class", "cell")
	                .attr("transform", function(d, i) { return "translate(" + xScale(i) + ", 0)"; });

	cell.append('rect')
	      .attr("width", xScale.rangeBand())
	      .attr("height", yScale.rangeBand())
	      .style("stroke-width", 0);

  cell.append("text")
	      .attr("dy", ".32em")
	      .attr("x", xScale.rangeBand() / 2)
	      .attr("y", yScale.rangeBand() / 2)
	      .attr("text-anchor", "middle")
	      .style("fill", function(d, i) { return d >= maxValue/2 ? 'white' : 'black'; })
	      .text(function(d, i) { return d; });

	row.selectAll(".cell")
	   .data(function(d, i) { return data[i]; })
	   .style("fill", colorMap);

	var labels = svg.append('g')
		                .attr('class', "labels");

	var columnLabels = labels.selectAll(".column-label")
	                         .data(labelsData)
	                         .enter()
	                         .append("g")
	                           .attr("class", "column-label")
	                           .attr("transform", function(d, i) { return "translate(" + xScale(i) + "," + height + ")"; });

	columnLabels.append("line")
		            .style("stroke", "black")
	              .style("stroke-width", "1px")
	              .attr("x1", xScale.rangeBand() / 2)
	              .attr("x2", xScale.rangeBand() / 2)
	              .attr("y1", 0)
	              .attr("y2", 5);

	columnLabels.append("text")
	              .attr("x", 45)
	              .attr("y", yScale.rangeBand() / 3)
	              .attr("text-anchor", "end")
	              .text(function(d, i) { return d; });

	var rowLabels = labels.selectAll(".row-label")
	                      .data(labelsData)
	                      .enter()
	                      .append("g")
	                      .attr("class", "row-label")
	                      .attr("transform", function(d, i) { return "translate(" + 0 + "," + yScale(i) + ")"; });

	rowLabels.append("line")
		         .style("stroke", "black")
	           .style("stroke-width", "1px")
	           .attr("x1", 0)
	           .attr("x2", -5)
	           .attr("y1", yScale.rangeBand() / 2)
	           .attr("y2", yScale.rangeBand() / 2);

	rowLabels.append("text")
	           .attr("x", -8)
	           .attr("y", yScale.rangeBand() / 2)
	           .attr("dy", ".32em")
	           .attr("text-anchor", "end")
	           .text(function(d, i) { return d; });
	           
	var y_label = labels.append("text")
                        .attr("transform", "rotate(-90)")
                        .style("font-size", "18px")
                        .attr("y", -45)
                        .attr("x", -240)
                        .text("True labels");
  
  var x_label = labels.append("text")
                        .style("font-size", "18px")
                        .attr("y", 460)
                        .attr("x", 145)
                        .text("Predict labels");
                        
  var plot_title = svg.append("text")
                        .attr("class", "title")
                        .style("font-size", "20px")
                        .attr("y", -20)
                        .attr("x", 60)
                        .text("Normalized confusion matrix")

  var key = d3.select("#legend")
              .append("svg")
                .attr("class", "legend")
                .attr("width", widthLegend)
                .attr("height", height + margin.top + margin.bottom);

  var legend = key.append("defs")
                  .append("svg:linearGradient")
                    .attr("id", "gradient")
                    .attr("x1", "100%")
                    .attr("y1", "0%")
                    .attr("x2", "100%")
                    .attr("y2", "100%")
                    .attr("spreadMethod", "pad");

  legend.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", endColor)
          .attr("stop-opacity", 1);

  legend.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", startColor)
          .attr("stop-opacity", 1);

  key.append("rect")
       .attr("width", widthLegend/2-10)
       .attr("height", height)
       .style("fill", "url(#gradient)")
       .attr("transform", "translate(0," + margin.top + ")");

  var yScale2 = d3.scale.linear()
                  .range([height, 0])
                  .domain([minValue, maxValue]);

  var yAxis = d3.svg.axis()
                .scale(yScale2)
                .orient("right");

  key.append("g")
       .attr("class", "yAxis")
       .attr("transform", "translate(41," + margin.top + ")")
       .call(yAxis)
}

function run_model() {
	var start_year = document.getElementById("start_year").value;
	var end_year = document.getElementById("end_year").value;
	if(parseInt(start_year) > parseInt(end_year)) {
	  document.getElementById("start_year").value = end_year;
	  document.getElementById("end_year").value = start_year;
	  start_year = document.getElementById("start_year").value;
	  end_year = document.getElementById("end_year").value;
	}
	d3.selectAll(".canvas").remove();
	d3.selectAll(".legend").remove();
	d3.json("http://localhost:5000/model/".concat(start_year).concat("/").concat(end_year), function(cm_data) {
	  Matrix({ container: "#container",
	           data: cm_data,
	           labels: labels,
	           start_color: "#FFFFFF",
	           end_color: "#E67E22"
	  })
	})
}

var labels = ["A","B","C","D","E"];

d3.json("http://localhost:5000/model/2010/2019", function(cm_data) {
	Matrix({ container: "#container",
			     data: cm_data,
			     labels: labels,
           start_color: "#FFFFFF",
           end_color: "#E67E22"
  });
})
                      
function main() {
	window.location.href = "index.html";
} 

function previous() {
	window.location.href = "page2.html";
}