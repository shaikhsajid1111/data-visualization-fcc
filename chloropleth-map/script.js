const educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';


var svg = d3.select("svg")

var countyData,educationData;
const tooltip = d3.select('#tooltip')

const createMap = (countyData,educationData) =>{
    svg.selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d',d3.geoPath())
    .attr('class','county')
    .attr('fill',(d) =>{
        let id = d['id'];
        let county = educationData.find((county) => {
            return county['fips'] === id
        }) 

        let percentage = county['bachelorsOrHigher']
        if(percentage <= 15){
            return 'tomato'
        }else if(percentage <= 30){
            return 'orange'
        }else if(percentage <= 45){
            return 'lightgreen'
        }else{
            return 'limegreen'
        }})
        .attr('data-fips', (item) => {
            return item['id']
        })
        .attr('data-education', (item) => {
            let fips = item['id']
            let county = educationData.find((county) => {
                return county['fips'] === fips
            })
            let percentage = county['bachelorsOrHigher']
            return percentage
        })
        .on('mouseover',(item) =>{
            tooltip.transition()
            .style("visibility",'visible')

            let id = item['id']
            let county = educationData.find((county) =>{
                return county['fips'] === id
            })

            tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + 
                    county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')
            tooltip.attr('data-education', county['bachelorsOrHigher'] )
        })
        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })

}


d3.json(countyURL).then(
    (data,err) => {
        if(err){
            console.log(err)

        }else{
            countyData = topojson.feature(data,data.objects.counties).features
            console.log(countyData)


            d3.json(educationURL).then(
                (data,err) =>{
                    if(err){
                        console.log(err)
                    }else{
                        educationData = data;
                        console.log(educationData)

                        createMap(countyData,educationData)
                    }
                }
            )
        }
        
        
    }
)