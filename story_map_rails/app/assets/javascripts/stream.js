$(document).ready(function(){
  var width = 960,
      height = 500;
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);
  var xAxis = d3.axisBottom(x);
  var color = d3.scaleLinear().range(["red", "blue"]);
  var stream = d3.select("#stream").attr("width", width).attr("height", height);


  d3.tsv("data/IPCC AR4 multi-model average of detrended globally averaged TAS anomalies relative to 1980-1999 - Sheet2.tsv", function(error, data) {
    var values = [];
    data.forEach(function(d) {
      d["year"] = +d["year"];
      d["20C3M"] = +d["20C3M"];
      d["commit"] = +d["commit"];
      d["B1"] = +d["B1"];
      d["A1B"] = +d["A1B"];
      d["A2"] = +d["A2"];

      Object.values(d).forEach(function(v){
        if (v > -20 && v < 20) {
          values.push(v);
        }
      });
    });

    var layers = Object.values(data[0]).length - 1;
    var years = data.length;
    var  stack = d3.stack()
        .keys(['20C3M',	'commit',	'B1',	'A1B',	'A2'])
  			.offset(d3.stackOffsetZero);
    var series = stack(data);
    x.domain([2000, 2100]);
    y.domain([-10, 10]);


    console.log(x.domain() + " " + y.domain());

    var area = d3.area()
        .x(function(d, i) { return x(d.data.year); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })
    		.curve(d3.curveBasis);
    stream.selectAll("path").data(series).enter().append("path").attr("d", area).style("fill", function() { return color(Math.random()); });
    stream.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + (height) + ")")
            .call(xAxis);
  });
});
