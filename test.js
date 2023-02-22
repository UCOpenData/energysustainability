/* Map Projections */

import { data } from './files/data.js'
console.log(data);

// returns center [width, height] of the svg
function getCenter(height) {
    // take coordinates of svg - dependent on height!
    /*var bbox = svg.getBBox();
    var height = bbox.height;*/
    var width = 0.81886*height;

    // calculate outut coordinates, based off of above vals
    // height is .372height from top
    // width is 313/409.43width from right (.764)
    console.log(width*.764);
    console.log(height*.372);

    return [width*.764, height*.372]
}

// find center dimensions. set width / height of svg element in html. 
var centDimensions = getCenter(document.getElementById("svg").getAttribute("height"));
var wtohratio = 409.43/500; var width = wtohratio*document.getElementById("svg").getAttribute("height");
document.getElementById("svg").setAttribute("width",width);

// this function takes a number of input parameters and draws a circle with them
// opacity - calculated from energy efficiency
// svg - given svg structure
// cx, cy - x,y coordinates (already adjusted)
const radius = 2;
function drawCircle(opacity, svg, lat, long) {
    var coords = adjustCoordinate(lat,long,  -.58, -510, centDimensions[0], centDimensions[1]);
    var cx = coords[0];
    var cy = coords[1];
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

var svg = d3.select("body")
  .append("svg")
  .attr("width",width)  // apply width,height to svg
  .attr("height",height);

var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);

d3.json("files/Boundaries - Neighborhoods.geojson", function(err, geojson) { 

      projection.fitSize([width,height],geojson); // adjust the projection to the features
      svg.append("path")
      .attr("d", path(geojson))
      .style("opacity", .60); // draw the features

    
})

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
svg.call(d3.zoom().on("zoom", function () {
    svg.attr("transform", d3.zoomTransform(this))
    }));

// path's x,y axis is as follows:
// y is whatever we set it to
// x is 0.81886y
// x origin is 313 at current scale; y origin is 186
// current scale is 500 height (490.43 width)


// center of chicago found somewhere - pull from existing
// tip of navy pier 41.891772596739635, -87.59896657803193
// x,y scales are ~2300, -510 respectively

var test = getCenter(svg.attr("height")); // outputs [x,y] values
var testAdjust = adjustCoordinate(41.881832,-87.623177, 1, 1, test[0], test[1]);
var testAdjust2 = adjustCoordinate(41.891772596739635,-87.59896657803193, 2300, -510, test[0], test[1]);

drawCircle(.5, svg, 41.881832, -87.623177);
drawCircle(.5, svg, 1.891772596739635, -87.59896657803193);
