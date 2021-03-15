const URL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

const Http = new XMLHttpRequest();

Http.open('GET',URL,true)

const svgWidth = 1200;
const svgHeight = 600;
const padding = 60;
let xScale,yScale,minYear,maxYear;

const svg = d3.select("svg")

var tooltip = d3.select('#tooltip')

const createCanvas = () =>{
    svg.attr("height",svgHeight)
    svg.attr("width",svgWidth)
}


const createScales = (data) =>{
    minYear = d3.min(data,(d) =>{
        return d['year'];
    })
    
    maxYear = d3.max(data,(d) =>{
        return d['year']
    })
    
    
    xScale = d3.scaleLinear()
    .domain([minYear,maxYear+1])
    .range([padding,svgWidth-padding])


    yScale = d3.scaleTime()
    .domain([new Date(0,0,0,0,0,0,0),new Date(0,12,0,0,0,0,0)])
    .range([padding,svgHeight-padding])
}

const createCells = (data,baseTemp) =>{
    svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class','cell')
    .attr('fill',(item) => {
        let variance = item['variance'];

        if(variance <= -2){
            return 'SteelBlue';
        }else if(variance <= 0){
            return "LightSteelBlue"

        }else if(variance < 1){
            return "Orange"
        }else {
            return 'Crimson'
        }

    })
    .attr('data-year',(d) => d['year'])
    .attr('data-month',(d) => d['month']-1)
    .attr('data-temp',(d) => baseTemp + d['variance'])
    .attr('height',(d) => (svgHeight-(2*padding))/12)
    .attr('y',(d) => yScale(new Date(0,d['month']-1,0,0,0,0,0)))
    .attr('width',(d) =>{
        let rectCount = maxYear - minYear;
        return (svgWidth - (2*padding))/ rectCount;
    })
    .attr('x',(d) => xScale(d['year']))
    .on('mouseover',(d) =>{
        tooltip.transition()
        .style('visibility','visible')
        
        let monthNames = ['January','February',
    'March','April','May','June','July','August','September','October','November','December']

        tooltip.text(d['year'] + ' ' + monthNames[d['month']-1] + d['variance'])
        tooltip.attr('data-year',d['year'])
    
    
    })

    .on('mouseout',(d) =>{
        tooltip.transition()
        .style('visibility','hidden')
    })

}
const createAxes = () =>{
    var xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('d'))

    svg.append('g')
    .call(xAxis)
    .attr('id','x-axis')
    .attr('transform', 'translate(0, ' + (svgHeight-padding) + ')')

    var yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.timeFormat("%B"))

    svg.append('g')
    .call(yAxis)
    .attr('id','y-axis')
    .attr('transform', 'translate(' + padding + ', 0)')
}

Http.onload = () =>{
    var json = JSON.parse(Http.responseText)
    var baseTemp = json['baseTemperature'];
    var data = json['monthlyVariance'];
    createCanvas()
    createScales(data)
    createCells(data,baseTemp)
    createAxes()

}
Http.send(null);