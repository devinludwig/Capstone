$(document).ready(function(){

  var width = 960,
      height = 960;

  var title = d3.select("h1");

  var projection = d3.geoOrthographic()
      .translate([width / 2, height / 2])
      .scale(width / 2 - 20)
      .clipAngle(90)
      .precision(0.6);

  // var canvas = d3.select("body").append("canvas")
  //     .attr("width", width)
  //     .attr("height", height);
  var svg = d3.select("#globe").append("svg")
    .attr("width", width)
    .attr("height", height)
  // var c = canvas.node().getContext("2d");

  var path = d3.geoPath()
      .projection(projection)
      // .context(c);

  var λ = d3.scaleLinear()
      .domain([0, width])
      .range([-180, 180]);

  var φ = d3.scaleLinear()
      .domain([0, height])
      .range([90, -90]);

  // svg.on("mousemove", function() {
  //   var p = d3.mouse(this);
  //   projection.rotate([λ(p[0]), φ(p[1])]);
  //   svg.selectAll("path").attr("d", path);
  // });

  svg.call(d3.drag()
    .on("drag", function() {
      var p = d3.mouse(this);
      projection.rotate([λ(p[0]), φ(p[1])]);
      svg.selectAll("path").attr("d", path);
    }));

  d3.queue()
      .defer(d3.json, "data/world-110m.json")
      .defer(d3.tsv, "data/world-country-names.tsv")
      .await(ready);

  function ready(error, world, names) {
    if (error) throw error;

    var globe = {type: "Sphere"},
        land = topojson.feature(world, world.objects.land),
        countries = topojson.feature(world, world.objects.countries).features,
        borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }),
        n = countries.length;

    svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);

    countries = countries.filter(function(d) {
      return names.some(function(n) {
        if (d.id == n.id) return d.name = n.name;
      });
    }).sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });

    // (function transition() {
    //   d3.transition()
    //       .duration(1250)
    //       .on("start", function() {
    //         title.text(countries[i = (i + 1) % n].name);
    //       })
    //       .tween("rotate", function() {
    //         var p = d3.geoCentroid(countries[i]),
    //             r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
    //         return function(t) {
    //           projection.rotate(r(t));
    //           c.clearRect(0, 0, width, height);
    //           c.fillStyle = "#ccc", c.beginPath(), path(land), c.fill();
    //           c.fillStyle = "#f00", c.beginPath(), path(countries[i]), c.fill();
    //           c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
    //           c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
    //         };
    //       })
    //     .transition()
    //       .on("end", transition);
    // })();
  }

  d3.select(self.frameElement).style("height", height + "px");
});
