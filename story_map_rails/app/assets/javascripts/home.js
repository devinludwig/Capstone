$(document).ready(function(){
  var width = 420,
  barHeight = 20;

  var x = d3.scaleLinear()
      .range([0, width]);

  var chart = d3.select("#visualization")
      .attr("width", width);

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
        };
      });
    });
    console.log(data[0])
    x.domain(d3.extent(values));
    console.log(x.domain());
    data.forEach(function(d) {
      });
  });

  d3.select("#visualization").html("Hello, world!");
});
