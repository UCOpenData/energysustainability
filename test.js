/* Map Projections */

// this function takes a number of input parameters and draws a circle with them
// opacity - calculated from energy efficiency
// svg - given svg structure
// cx, cy - x,y coordinates (already adjusted)
// radius - circle radius (should be constant)
function drawCircle(opacity, svg, cx, cy, radius) {
    svg.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", radius)
        .style("opacity", opacity)
}

// this function takes in the latitude, longitude and returns its svg x,y coord
// figue our xscale, yscale later
const centerLat = 41.881832; const centerLong = -87.623177;
function adjustCoordinate(latitude, longitude, xscale, yscale, xorigin, yorigin) {
    var x_svg_coord = latitude-centerLat;
    var y_svg_coord = longitude-centerLong;
    return [x_svg_coord*xscale + xorigin, y_svg_coord*yscale + yorigin];
}


var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var projection = d3.geoMercator()
    /*.scale((width-4) / (Math.PI / 5))
    .translate([width / 2, height / 2])*/
    //.center([-87.554420,41.739685]);

var path = d3.geoPath()
    .projection(projection);

var graticule = d3.geoGraticule();

/*svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);*/

/*svg.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");*/

/*svg.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");*/

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

d3.json("files/chineighborhoods.json", function(error, chicago) {
  if (error) throw error;

var testAdjust = adjustCoordinate(41.881832,-87.623177, 1, 1, 500, 100);

drawCircle(.5, svg, testAdjust[0], testAdjust[1], 20);

  /*svg.insert("path", ".graticule")
      .datum(topojson.feature(chicago, chicago.objects.land))
      .attr("class", "land")
      .attr("d", path);*/

  /*svg.insert("path", ".graticule")
      .datum(topojson.mesh(chicago, chicago.objects.chicagocommunityareas, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);*/
});