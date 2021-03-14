const URL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

const Http = new XMLHttpRequest()

let xScale,yScale;
let svgWidth = 800
let svgHeight = 600
let padding = 40

const svg = d3.select('svg')
const tooltip = d3.select('#tooltip')

const createCanvas = () =>{
    svg
    .attr("width",svgWidth)
    .attr('height',svgHeight)

}

const createScales = (data) => {
    xScale = d3.scaleLinear()
    .domain([d3.min(data,(d)=>{
        return d['Year']
    }),d3.max(data,d =>{
        return d['Year']
    })])
    .range([padding,svgWidth-padding])

    yScale = d3.scaleTime()
    .domain([d3.min(data,(d)=>{
        return new Date(d['Seconds']*1000)
    }),d3.max(data,d =>{
        return new Date(d['Seconds']*1000)
    })])

    .range([padding,svgHeight-padding,])
}

const createPoint = (data) =>{
    console.log(data)
    svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class','dot')
    .attr('r','5')
    .attr('data-xvalue', (d) => {
        return d['Year']
    })
    .attr('data-yvalue', (d) => {
        return new Date(d['Seconds']*1000) 
    })
    .attr('cx',(d) => xScale(d['Year']))
    .attr('cy',(d) => yScale(new Date(d['Seconds']*1000)))
    .attr('fill',(item)=> {
        return item['Doping'] != '' ? 'orange' : 'lightgreen'
    })
    .on('mouseover',(item) =>{
        tooltip.transition()
        .style('visibility','visible')
        if(item['Doping'] != ""){
            tooltip.text(item['Year'] + ' - ' + item['Name'] + ' - ' + item['Time'] + ' - ' + item['Doping'])
        }else{
            tooltip.text(item['Year'] + ' - ' + item['Name'] + ' - ' + item['Time'] + ' - ' + 'No Allegations')
        }
        tooltip.attr('data-year',item['Year'])
    })
    .on('mouseout', (item) => {
        tooltip.transition()
            .style('visibility', 'hidden')
    })

}

const createAxes = () =>{   
    let xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('d'))
    svg.append('g')
    .call(xAxis)
    .attr("id",'x-axis')
    .attr('transform', 'translate(0, ' + (svgHeight-padding) +')')

    let yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.timeFormat("%M:%S"))
    svg.append('g')
    .call(yAxis)
    .attr('id','y-axis')
    .attr('transform','translate('+padding+',0)')
}


Http.open("GET",URL,true)
Http.onload = () =>{
    var data = JSON.parse(Http.responseText)
    createCanvas()
    createScales(data)
    createPoint(data)
    createAxes()
}
Http.send(null)



