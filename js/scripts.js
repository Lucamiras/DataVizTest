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
    d3.selectAll('circle').remove();
    const dataURL = "https://www.berlin.de/lageso/gesundheit/infektionskrankheiten/corona/tabelle-indikatoren-gesamtuebersicht/index.php/index/all.json?q=";
    d3.json(dataURL).then( data => {
        let points = d3.select('svg').selectAll('dots').data(data.index);
        let maxIndex = data.index[0].id
        let maxDeath = data.index[1].todesfaelle
        const max = d3.max(data.index, d => Math.abs(d.neue_faelle));
        const color = d3.scaleSequential()
            .domain([max, 0])
            .interpolator(d3.interpolateRdBu);
        //console.log(maxDeath)
      points.join('circle')
            .attr('cx', d => d.id / maxIndex * 500)
            .attr('cy', d => 500 - d['todesfaelle'] / maxDeath * 500)
            .transition()
            .duration(1000)
            .attr('r', d => 1 + (d['neue_faelle']/200))
            .attr("fill", "none")
            .attr("stroke", d => color(d.neue_faelle))
            .attr("stroke-width", 1);
              d3.selectAll('circle').on('mouseover', function(){
            let date = maxDeath - (d3.select(this).attr('cy') / 500 * maxDeath);
            let circleColor = d3.select(this).attr('stroke')
            d3.select('#coord-tracker').text(`${date} deaths`).style('color',circleColor)
        });
     
})
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

