// Here is the data to plot
var NBAdata = [{Pos: "2010", meanAge: 2686},
{Pos: "2011", meanAge: 2574},
{Pos: "2012", meanAge: 1693},
{Pos: "2013", meanAge: 874},
{Pos: "2014", meanAge: 1626},
{Pos: "2015", meanAge: 2738},
{Pos: "2016", meanAge: 1629},
{Pos: "2017", meanAge: 1676},
{Pos: "2018", meanAge: 743},
{Pos: "2019", meanAge: 1723}]

// Generate a SVG
var margin = {
  top: 60,
  right: 80,
  bottom:60,
  left: 80
}

var width = 400;
var height = 250;

var svg = d3.select("body")
						.append("svg")
							.attr("width", margin.left + margin.right + width)
							.attr("height", margin.top + margin.bottom + height)
						.append("g")
							.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Define the scales
var x_Scale = d3.scale.ordinal()
.rangeRoundBands([0, width], 0.3)
.domain(NBAdata.map(function(d) { return d.Pos;}));

var y_Scale = d3.scale.linear()
.range([height, 20])
.domain([0, d3.max(NBAdata, function(d) { return d.meanAge;})]);


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
.html(function(d) { return "<strong>Annual Consumption:</strong> <span style='color:black'>" + d.meanAge + "</span>";})

svg.call(retriever);


// Draw data and show retrieve interactivity
var Bar = svg.selectAll("Bar")
.data(NBAdata)
.enter()
.append("rect")
.attr("class", "Bar")
.attr("x", function(d) { return x_Scale(d.Pos);})
.attr("width", x_Scale.rangeBand())
.attr("y", function(d) { return y_Scale(d.meanAge);})
.attr("height", function(d) { return height  - y_Scale(d.meanAge);})
.attr("fill", "blue")
.on('mouseover', retriever.show)
.on('mouseout', retriever.hide)


// Add labels for the axes
svg.append("g")
.attr("class", "xAxis")
.attr("transform", "translate(0," + height + ")")
.call(x_Axis)
.append("text")
.style("font-size", "18px")
.attr("y", 40)
.attr("x", 120)
.text("Year");

svg.append("g")
.attr("class", "yAxis")
.call(y_Axis)
.append("text")
.attr("transform", "rotate(-90)")
.style("font-size", "18px")
.attr("y", -65)
.attr("x", -200)
.text("Annual Consumption");

// Add title for the plot
svg.append("text")
.style("font-size", "18px")
.attr("y", -20)
.attr("x", 30)
.text("Annual Consumption For Amsterdam")

function updateTextInput(val) {
    document.getElementById('textoutput').value=val;
    d3.selectAll(".Bar").remove();
    var Bar = svg.selectAll("Bar")
    .data(NBAdata)
    .enter()
    .append("rect")
    .attr("class", "Bar")
    .attr("x", function(d) { return x_Scale(d.Pos);})
    .attr("width", x_Scale.rangeBand())
    .attr("y", function(d) { return y_Scale(d.meanAge);})
    .attr("height", function(d) { return height  - y_Scale(d.meanAge);})
    .attr("fill", function(d){
      if(d.Pos == val) {
        return "red"
      }
      else {
        return "blue"
      }
    })
    .on('mouseover', retriever.show)
    .on('mouseout', retriever.hide)
}







var svg2 = d3.select("body")
.append("svg")
.attr("width", margin.left + margin.right + width)
.attr("height", margin.top + margin.bottom + height)
.append("g")
.attr("transform", "translate(" + margin.right + "," + margin.top + ")");


// Draw data and show retrieve interactivity
var Bar = svg2.selectAll("Bar")
.data(NBAdata)
.enter()
.append("rect")
.attr("class", "Bar")
.attr("x", function(d) { return x_Scale(d.Pos);})
.attr("width", x_Scale.rangeBand())
.attr("y", function(d) { return y_Scale(d.meanAge);})
.attr("height", function(d) { return height  - y_Scale(d.meanAge);})
.attr("fill", "blue")
.on('mouseover', retriever.show)
.on('mouseout', retriever.hide)


// Add labels for the axes
svg2.append("g")
.attr("class", "xAxis")
.attr("transform", "translate(0," + height + ")")
.call(x_Axis)
.append("text")
.style("font-size", "18px")
.attr("y", 40)
.attr("x", 120)
.text("Year");

svg2.append("g")
.attr("class", "yAxis")
.call(y_Axis)
.append("text")
.attr("transform", "rotate(-90)")
.style("font-size", "18px")
.attr("y", -65)
.attr("x", -200)
.text("Annual Consumption");

// Add title for the plot
svg2.append("text")
.style("font-size", "18px")
.attr("y", -20)
.attr("x", 30)
.text("Annual Consumption For Amsterdam")