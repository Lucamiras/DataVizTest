console.log('Successfully loaded scripts.js. Good job Lucas!')

const pointSize = 5;

function addFunc(x) {
    let adder = 5;
    return x + adder;
}

function drawCircles(){
    let myData = [150,250,350];

    let circles = d3.select('svg')
    .selectAll('square')
    .data(myData);

    circles.join('circle')
    .attr('cx', d=>d)
    .attr('cy', d=>d)
    .attr('r', 50);
}

function randomlyMoveCircles(){
    //console.log('RANDOM')
    random_numbers = []
    numberOfCircles = d3.selectAll('circle').nodes().length
    for (i = 1; i < numberOfCircles + 1; i++){
        random_numbers.push([Math.random()*500, Math.random()*500]);
    };
    //console.log(random_numbers)
    d3.selectAll('circle').data(random_numbers)
    .transition()
    .attr('cx', d => d[0])
    .attr('cy', d => d[1])
}

function plotCovidData(){
    
    const url = 'https://www.berlin.de/lageso/gesundheit/infektionskrankheiten/corona/tabelle-indikatoren-gesamtuebersicht/index.php/index/all.json?q=';

    // Load the JSON data
    d3.json(url)
      .then(function(data) {
        // Extract the data you need
        const dataArray = data.index.map(function(d) {
          return {
            date: new Date(d.datum),
            deaths: +d.neue_faelle
          };
        });
				console.log(dataArray)
        // Set up SVG and margins
        const margin = { top: 50, right: 30, bottom: 30, left: 100 };
        const width = 950 - margin.left - margin.right;
        const height = 450 - margin.top - margin.bottom;

        // Append SVG
        const svg = d3.select("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Set up scales
        const xScale = d3.scaleTime()
          .domain(d3.extent(dataArray, d => d.date))
          .range([0, width]);

        const yScale = d3.scaleLinear()
          .domain([0, d3.max(dataArray, d => d.deaths)])
          .nice()
          .range([height, 0]);

        // Set up axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        // Append axes
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        svg.append("g")
          .call(yAxis);

        // Define the line
        const line = d3.line()
          .x(d => xScale(d.date))
          .y(d => yScale(d.deaths));
				console.log(line)
        // Append the line
        svg.append("path")
          .datum(dataArray)
          .transition()
          .duration(2000)
		  .attr("fill",'none')
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          
          .attr("d", line);
      })
      .catch(function(error) {
        console.log("Error loading the data: " + error);
      });
}

function loadData(path){
    d3.csv(path)
    .then(function(data) {
        let mySVG = d3.select('svg')
        .selectAll('dots')
        .data(data);
        mySVG.join('circle')
        .transition()
        .attr('cx',d => d.Xi)
        .attr('cy', d => d.Yi)
        .attr('r', pointSize) 

        d3.selectAll('circle').on('mouseover', function(){
            let thisx = d3.select(this).attr('cx');
            let thisy = d3.select(this).attr('cy');
            d3.select('#coord-tracker').text(`${thisx},${thisy}`);
            d3.select(this).transition().attr('r',pointSize*3);
        })
        
        d3.selectAll('circle').on('mouseout', function(){
            d3.select(this).transition().attr('r',pointSize)
        })
    });
}

function clusterData(){
    d3.selectAll('circle')
    .transition()
    .duration(1500)
    .attr('cx',d => d.Xf)
    .attr('cy', d => d.Yf)
    .attr('r', pointSize)
    .style('fill', d => d.color);
}

function removeData(){
    d3.selectAll('circle').remove()
}

