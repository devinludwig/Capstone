$(document).ready(function(){
  d3.tsv("data/IPCC AR4 multi-model average of detrended globally averaged TAS anomalies relative to 1980-1999 - Sheet2.tsv", function(error, data) {
    console.log(data);
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
    });
  });

  d3.select("#visualization").html("Hello, world!");
});
