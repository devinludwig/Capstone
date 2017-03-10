// http://bl.ocks.org/mbostock/3943967
// NASA Earth Exchange Downscaled Climate Projections, Ensemble Average, Epicodus
$(document).ready(function(){
  // var width = d3.select('#yield').node().getBoundingClientRect().width;
  //     height = width;
  var tasmax = [],
      tasmin = [],
      pr = [];
  var groupBy = function(variableSet, key) {
    return variableSet.reduce(function (rv, x) { let v = key instanceof Function ? key(x) : x[key];
    let el = rv.find((r) => r && r.key === v); if (el) { el.values.push(x); } else { rv.push({ key: v, values: [x] }); } return rv; }, []);
  }

  d3.csv('data/data.csv', function(error, data) {
    data.forEach(function(d) {
      if (d.Variable == "tasmax") {
        tasmax.push(d);
      } else if (d.Variable == "tasmin") {
        tasmin.push(d);
      } else {
        pr.push(d);
      }
    });
    var variables = [tasmax, tasmin, pr].map(function(variable) {
      return group = groupBy(variable, "Scenario");
    });
    console.log(variables[0]);
    var n = 5, // The number of series.
      m = 670, // The number of values per series.
    // The xz array has m elements, representing the x-values shared by all series.
    // The yz array has n elements, representing the y-values of each of the n series.
    // Each yz[i] is an array of m non-negative numbers representing a y-value for xz[i].
    // The y01z array has the same structure as yz, but with stacked [y₀, y₁] instead of y.
      xz = d3.range(m),
      yz = d3.range(n).map(function(index) {
      var sc = [];
      variables[2][index].values.forEach(month => {
      sc.push(+month.Value);});
      return sc;
    });

    y01z = d3.stack().keys(d3.range(n))(d3.transpose(yz)),
    yMax = d3.max(yz, function(y) { return d3.max(y); }),
    y1Max = d3.max(y01z, function(y) { return d3.max(y, function(d) { return d[1]; }); });
    console.log(yMax, y1Max);

  var svg = d3.select("#bars");
  var margin = {top: 40, right: 10, bottom: 20, left: 10},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand()
      .domain(xz)
      .rangeRound([0, width])
      .padding(0.08);

  var y = d3.scaleLinear()
      .domain([0, y1Max])
      .range([height, 0]);

  var color = d3.scaleOrdinal()
      .domain(d3.range(n))
      .range(d3.schemeCategory20c);

  var series = g.selectAll(".series")
    .data(y01z)
    .enter().append("g")
      .attr("fill", function(d, i) { return color(i); });

  var rect = series.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d, i) { return x(i) - 296; })
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0);

  rect.transition()
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); });

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(-296," + height + ")")
      .call(d3.axisBottom(x)
          // .ticks(400)
          // .tickSize(0)
          // .tickPadding(6)
        );

  d3.selectAll("input")
      .on("change", changed);

  var timeout = d3.timeout(function() {
    d3.select("input[value=\"grouped\"]")
        .property("checked", true)
        .dispatch("change");
  }, 2000);

  function changed() {
    timeout.stop();
    if (this.value === "grouped") transitionGrouped();
    else transitionStacked();
  }

  function transitionGrouped() {
    y.domain([0, yMax]);

    rect.transition()
        .duration(500)
        .delay(function(d, i) { return i * 10; })
        .attr("x", function(d, i) { return x(i) + x.bandwidth() / n * this.parentNode.__data__.key - 296; })
        .attr("width", x.bandwidth() / n)
      .transition()
        .attr("y", function(d) { return y(d[1] - d[0]); })
        .attr("height", function(d) { return y(0) - y(d[1] - d[0]); });
  }

  function transitionStacked() {
    y.domain([0, y1Max]);

    rect.transition()
        .duration(500)
        .delay(function(d, i) { return i * 10; })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .transition()
        .attr("x", function(d, i) { return x(i) - 296; })
        .attr("width", x.bandwidth());
    }
  });
});
