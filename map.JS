//<script src="https://d3js.org/d3.v7.min.js"></script>
//should use map projection but do cook county projection with d3.js
//https://github.com/topojson/us-atlas
//https://observablehq.com/@d3/u-s-map
//https://observablehq.com/@d3/bubble-map
//document.createElement(map);
  //{
  // header
//const d = require(d3);
import * as d3 from 'https://cdn.skypack.dev/d3@7';
import * as topojson from "https://cdn.skypack.dev/topojson";


  // 
  /*var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  var path = d3.geoPath();*/

  /* ---- FETCH DATA, data processing functions ----- */
  const chi = fetch("files/chineighborhoods.json")
    .then(response => response.json())
    .then(data => {console.log(data); return data; console.log("Success");})

  const engdata = fetch("files/2018_data.json")
  .then(response => response.json())
  .then(data => {console.log(data); return data; console.log("Success");})

  const chicago = async () => {
    const a = await chi;
    return a;
  };

  const endat = async () => {
    const a = await engdata;
    return a;
  };

  const chimesh = async () => {
    const c = await chicago();
    console.log(c);
    //var feature = topojson.feature(c, "features");
    //console.log(feature);
    // huge thanks to https://github.com/RandomFractals/ChicagoCrimes/blob/master/data/chicago-community-areas.topojson for this json!
    const ans = topojson.mesh(c, c.objects.chicagocommunityareas, (a, b) => a !== b); // need to rearrange the json file
    console.log(ans); return ans;
  };
  //data = (await ("files/2018_data.csv").csv()).map(d => d["Chicago Energy Rating"])
  console.log(await chimesh());


  /* ---- Actual Map Implementation ----- */
  var end = endat();
  //chim = chimesh();
  var chart = BubbleMap(await end, {
    value: (data) => parseInt(data.Chicago_Energy_Rating),
    position(data) {
      //console.log(data.Latitude);
      return [parseInt(data.Latitude), parseInt(data.Longitude)];
    },
    title(data) {
      return data.Property_Name;
    },
    features: chi,
    border: chimesh(),
    width: 500,
    height: 500
  });

  document.getElementById("map").appendChild(chart);



/* ---- Bubble Map Function ----- */
// Copyright 2022 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/bubble-map
function BubbleMap(data, {
  position = d => d, // given d in data, returns the [longitude, latitude]
  value = () => undefined, // given d in data, returns the quantitative value
  title, // given a datum d, returns the hover text
  scale = d3.scaleSqrt, // type of radius scale
  domain, // [0, max] values; input of radius scale; must start at zero
  maxRadius = 20, // maximum radius of bubbles
  width = 640, // outer width, in pixels
  height, // outer height, in pixels
  projection = d3.geoMercator()
  .scale(width * 90)
  .center([-87.6231, 41.8818]) // this is flipped from data
  .translate([width / 2, height / 2]), // a D3 projection; null for pre-projected geometry
  features, // a GeoJSON feature collection for the background
  borders, // a GeoJSON object for stroking borders
  outline = projection && projection.rotate ? {type: "Sphere"} : null, // a GeoJSON object for the background
  backgroundFill = "#e0e0e0", // fill color for background
  backgroundStroke = "black", // stroke color for borders
  backgroundStrokeWidth, // stroke width for borders
  backgroundStrokeOpacity, // stroke width for borders
  backgroundStrokeLinecap = "round", // stroke line cap for borders
  backgroundStrokeLinejoin = "round", // stroke line join for borders
  fill = "blue", // fill color for bubbles
  fillOpacity = 1, // fill opacity for bubbles
  stroke = "white", // stroke color for bubbles
  strokeWidth = 1, // stroke width for bubbles
  strokeOpacity, // stroke opacity for bubbles
  legendX = width - maxRadius - 10,
  legendY = height - 10,
} = {}) {
  // Compute values.
  const I = d3.map(data, (_, i) => i);
  const V = d3.map(data, value).map(d => d == null ? NaN : +d);
  const P = d3.map(data, position);
  const T = title == null ? null : d3.map(data, title);

  // Compute default domains.
  if (domain === undefined) domain = [0, d3.max(V)];

  // Construct scales.
  const radius = scale(domain, [0, maxRadius]);

  // Compute the default height. If an outline object is specified, scale the projection to fit
  // the width, and then compute the corresponding height.
  if (height === undefined) {
    if (outline === undefined) {
      height = 400;
    } else {
      const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
      const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
      projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
      height = dy;
      console.log(height);
    }
  }

  // Construct a path generator.
  console.log("proj")
  console.log(projection)
  const path = d3.geoPath(projection);

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "width: 100%; height: auto; height: intrinsic;");

  if (outline != null) svg.append("path")
      .attr("fill", "white")
      .attr("stroke", "currentColor")
      .attr("d", path(outline));

  svg.append("path")
      .datum(features)
      .attr("fill", backgroundFill)
      .attr("d", path);

  if (borders != null) svg.append("path")
      .attr("pointer-events", "none")
      .attr("fill", "none")
      .attr("stroke", backgroundStroke)
      .attr("stroke-linecap", backgroundStrokeLinecap)
      .attr("stroke-linejoin", backgroundStrokeLinejoin)
      .attr("stroke-width", backgroundStrokeWidth)
      .attr("stroke-opacity", backgroundStrokeOpacity)
      .attr("d", path(borders));

  const lx = legendX;
  const ly = legendY;
  const legend = svg.append("g")
      .attr("fill", "#777")
      .attr("transform", `translate(${lx},${ly})`)
      .attr("text-anchor", "middle")
      .style("font", "10px sans-serif")
    .selectAll("g")
      .data(radius.ticks(4).slice(1))
    .join("g");

  legend.append("circle")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("cy", d => -radius(d))
      .attr("r", radius);

  legend.append("text")
      .attr("y", d => -2 * radius(d))
      .attr("dy", "1.3em")
      .text(radius.tickFormat(4, "s"));

  svg.append("g")
      .attr("fill", fill)
      .attr("fill-opacity", fillOpacity)
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-opacity", strokeOpacity)
    .selectAll("circle")
    .data(d3.range(data.length)
        .filter(i => P[i])
        .sort((i, j) => d3.descending(V[i], V[j])))
    .join("circle")
      .attr("transform", projection == null
          ? i => `translate(${P[i]})`
          : i => `translate(${projection(P[i])})`)
      .attr("r", i => radius(V[i]))
      .call(T ? circle => circle.append("title").text(i => T[i]) : () => {});

    console.log(P)
    console.log(projection(P[3]))

  return Object.assign(svg.node(), {scales: {radius}});
};