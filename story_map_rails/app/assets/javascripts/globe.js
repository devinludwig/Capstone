$(document).ready(function(){

  var width = d3.select('#yield').node().getBoundingClientRect().width*.8;
      height = width;
  var title = d3.select("h1");

  var projection = d3.geoOrthographic()
      .translate([width / 2, height / 2])
      .scale(width / 2 - 20)
      .clipAngle(90)
      .precision(0.6);

  var svg = d3.select("#globe").append("svg")
    .attr("width", width)
    .attr("height", height);

  var path = d3.geoPath()
      .projection(projection);

  var graticule = d3.geoGraticule()
    .step([10, 10]);

  var zoom = d3.zoom()
    .scaleExtent([1 / 2, 96])
    .on("zoom", zoomed);

  svg.call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged))
    .call(zoom);
    // .call(zoom.transform, d3.zoomIdentity);;

  function zoomed() {
    var t = d3.event.transform;
      t.y = height * t.k;
      svg.attr("transform", t);
      // debugger;
  }

  var render = function() {},
      v0, // Mouse position in Cartesian coordinates at start of drag gesture.
      r0, // Projection rotation as Euler angles at start.
      q0; // Projection rotation as versor at start.

  function dragstarted() {
    v0 = versor.cartesian(projection.invert(d3.mouse(this)));
    r0 = projection.rotate();
    q0 = versor(r0);
  }

  function dragged() {
    var v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(this))),
        q1 = versor.multiply(q0, versor.delta(v0, v1)),
        r1 = versor.rotation(q1);
    projection.rotate(r1);
    render();
  }

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

    svg.append("path")
      .datum({type: "Sphere"})
      .attr("class", "water")
      .attr("d", path);

    render = function() {
      svg.selectAll("path.land, path.graticule").remove();
      svg.selectAll('path.graticule').data([graticule()])
        .enter().insert('path').classed('graticule', true)
        .attr('d', path)
        .exit();
      var shapes = svg.selectAll('path.land').data(countries)
        .enter().append("path")
        .attr("class", "land")
        .attr("d", path);
      shapes.on("mouseover", function(datum) {
        d3.select('#country').text(findNameById(names, datum.id).name)
      })
      .on("mouseout", function() {d3.select('#country').text('')})
      .on("click", function(datum) {
        console.log(d3.mouse(this));
        // get(JSON.stringify(datum.geometry.coordinates[0]))
      });
    };

    render();

    //Adding countries to select

    names.forEach(function(n) {
      // countries[n.id] = n.name;
      option = d3.select('#countries').append("option");
      option.text(n.name);
      option.property("value", n.id);
    });
    $('select').material_select();

    countries = countries.filter(function(d) {
      return names.some(function(n) {
        if (d.id == n.id) return d.name = n.name;
      });
    }).sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });
    //Country focus on option select

    $(".select-wrapper").on("change", function() {
      var rotate = projection.rotate(),
        focusedCountry = findShapeById(countries, $("#countries").val()),
        p = d3.geoCentroid(focusedCountry);
      svg.selectAll(".focused").classed("focused", focused = false);
    //Globe rotating

      (function transition() {
        d3.transition()
          .duration(1000)
        .tween("rotate", function() {
          var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
          return function(t) {
            projection.rotate(r(t));
            svg.selectAll("path").attr("d", path)
            .classed("focused", function(d, i) { return d.id == focusedCountry.id ? focused = d : false; });
          };
        })
      })();
    });


    function findShapeById(countries, selection) {
      for(var i = 0, l = countries.length; i < l; i++) {
        if(countries[i].id == selection) {return countries[i];}
      }
    };
    function findNameById(names, id) {
      for(var i = 0, l = names.length; i < l; i++) {
        if(names[i].id == id) {return names[i];}
      }
    };
  };

  d3.select(self.frameElement).style("height", height + "px");
});
