$(document).ready(function(){
  var width = 420,
  barHeight = 20;

  var x = d3.scaleLinear()
      .range([0, width]);

  var chart = d3.select("#visualization")
      .attr("width", width);

  d3.tsv("data/IPCC AR4 multi-model average of detrended globally averaged TAS anomalies relative to 1980-1999 - Sheet2.tsv", function(error, data) {
    console.log(data);
  var values = [];
  debugger;
  data.forEach(function(d) {
    Object.values(d).forEach(function(v){
      if (v > -20 && v < 20) {
        values.push(v);
      };
    });
  });
  console.log(values)

  x.domain([d3.min(values), d3.max(data)]);
  data.forEach(function(d) {
    });
  });

  d3.select("#visualization").html("Hello, world!");
});
