// !! IMPORTANT README:
// You may add additional external JS and CSS as needed to complete the project, however the current external resource MUST remain in place for the tests to work. BABEL must also be left in place. 
/***********
INSTRUCTIONS:
  - Select the project you would
    like to complete from the dropdown
    menu.
  - Click the "RUN TESTS" button to
    run the tests against the blank
    pen.
  - Click the "TESTS" button to see
    the individual test cases.
    (should all be failing at first)
  - Start coding! As you fulfill each
    test case, you will see them go
    from red to green.
  - As you start to build out your
    project, when tests are failing,
    you should get helpful errors
    along the way!
    ************/
// PLEASE NOTE: Adding global style rules using the * selector, or by adding rules to body {..} or html {..}, or to all elements within body or html, i.e. h1 {..}, has the potential to pollute the test suite's CSS. Try adding: * { color: red }, for a quick example!
// Once you have read the above messages, you can delete all comments. 
var API_URL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
var svgWidth = 800;
var svgHeight = 600;
var padding = 40;
var heightScale, xScale, xAxisScale, yAxisScale;
var svg = d3.select("svg");
var Http = new XMLHttpRequest();
var createScales = function (data) {
    heightScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (item) {
            return item[1];
        })])
        .range([0, svgHeight - (2 * padding)]);
    xScale = d3.scaleLinear()
        .domain([0, data.length - 1])
        .range([padding, svgWidth - padding]);
    var datesArray = data.map(function (item) {
        return new Date(item[0]);
    });
    console.log(datesArray);
    xAxisScale = d3.scaleTime()
        .domain([d3.min(datesArray), d3.max(datesArray)])
        .range([padding, svgWidth - padding]);
    yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d[1]; })])
        .range([svgHeight - padding, padding]);
};
var createBars = function (data) {
    var tooltip = d3.select("body")
        .append('div')
        .attr('id', 'tooltip')
        .style("visibility", 'hidden')
        .style("height", 'auto')
        .style("width", 'auto');
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr('class', 'bar')
        .attr('width', (svgWidth - (2 * padding)) / data.length)
        .attr('data-date', function (item) { return item[0]; })
        .attr("data-gdp", function (item) { return item[1]; })
        .attr('height', function (item) {
        return heightScale(item[1]);
    })
        .attr('x', function (d, i) { return xScale(i); })
        .attr('y', function (item) { return (svgHeight - padding) - heightScale(item[1]); })
        .on('mouseover', function (item) {
        tooltip.transition()
            .style("visibility", 'visible');
        tooltip.text(item[0]);
        document.getElementById('tooltip').setAttribute('data-date', item[0]);
    })
        .on('mouseout', function (item) {
        tooltip.transition()
            .style('visibility', 'hidden');
    });
};
var createAxes = function () {
    var xAxis = d3.axisBottom(xAxisScale);
    var yAxis = d3.axisLeft(yAxisScale);
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (svgHeight - padding) + ')');
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)');
};
var createCanvas = function () {
    svg.attr('width', svgWidth);
    svg.attr('height', svgHeight);
};
Http.open("GET", API_URL, true);
Http.onload = function () {
    var json = JSON.parse(Http.responseText);
    var data = json['data'];
    createCanvas();
    createScales(data);
    createBars(data);
    createAxes();
};

Http.send(null);

