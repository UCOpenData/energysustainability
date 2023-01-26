/* Map Projections */

// this function takes a number of input parameters and draws a circle with them
// opacity - calculated from energy efficiency
// svg - given svg structure
// cx, cy - x,y coordinates (already adjusted)
const radius = 10
function drawCircle(opacity, svg, cx, cy) {
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
//<script src="./files/testdata.json"></script>
//const chi_data = JSON.parse("/files/testdata.json");
//console.log(chi_data);

var svg = d3.select("body")
  .append("svg")
  .attr("width",width)  // apply width,height to svg
  .attr("height",height);

var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);

var width = 900;
var height = 500;

d3.json("files/Boundaries - Neighborhoods.geojson", function(err, geojson) { 

      projection.fitSize([width,height],geojson); // adjust the projection to the features
      svg.append("path")
      .attr("d", path(geojson))
      .style("opacity", .75); // draw the features

})

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");


var path = d3.geoPath()
    .projection(projection);

var graticule = d3.geoGraticule();

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);


var testAdjust = adjustCoordinate(41.881832,-87.623177, 1, 1, 500, 100);

drawCircle(.5, svg, testAdjust[0], testAdjust[1], 20);
