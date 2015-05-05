/*This is where the D# Visualization is defined*/

var margin = {
  top: 20,
  right: 20,
  bottom: 100,
  left: 40
};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

//define scale of x to be from 0 to width of SVG, with .1 padding in between
var scaleX = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

//define scale of y to be from the height of SVG to 0
var scaleY = d3.scale.linear()
  .range([height, 0]);

//define axes
var xAxis = d3.svg.axis()
  .scale(scaleX)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(scaleY)
  .orient("left");

//create svg
var svg = d3.select("#chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* Initialize tooltip. The reason d3 knows to call this function on this
  kind of object is because of the way d3-tip defined the function. you
  can find this in d3-tip.js in public/js. It's linked in
  views/layouts/layout.handlebars */
var tip = d3.tip().attr('class', 'd3-tip').html(function (d) {
  return d;
});
/*This is where the tip is initialized in the scope of our chart
  if this weren't here, our chart (svg) wouldn't know what we're talking
  about.
*/
svg.call(tip);

//get json object which contains media counts
d3.json('/igMediaCounts', function (error, data) {
  //set domain of x to be all the usernames contained in the data
  scaleX.domain(data.users.map(function (d) {
    return d.username;
  }));
  //set domain of y to be from 0 to the maximum media count returned
  scaleY.domain([0, d3.max(data.users, function (d) {
    return d.counts.media;
  })]);

  //set up x axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")") //move x-axis to the bottom
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function (d) {
      return "rotate(-65)"
    });

  //set up y axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Number of Photos");

  //set up bars in bar graph
  svg.selectAll(".bar")
    .data(data.users)
    .enter().append("rect")
    .attr("class", "bar")
    /*here, d is the user. this works because in app.js, they call
      this file in the context of the response they get from a facebook
      authentication response*/
    .attr("x", function (d) {
      return scaleX(d.username);
    })
    .attr("width", scaleX.rangeBand())
    .attr("y", function (d) {
      return scaleY(d.counts.media);
    })
    .attr("height", function (d) {
      return height - scaleY(d.counts.media);
    })
    /*this is where the tooltip magic happens- we're telling it to use
    the same data that calculates the height of each bar, but represent it
    as a number raw number rather than height for an infographic*/
    .on('mouseover', function (d) {
      tip.show(d.counts.media)
    })
    .on('mouseout', tip.hide);

  //sort the bars in order from least to greatest
  d3.select("button").on("click", function () {
    //disables the button after being clicked
    this.disabled = true;
    //if box is checked, sort by media
    var scaleX_sorted = scaleX.domain(data.users.sort(function (a, b) {
        return a.counts.media - b.counts.media;
      })
      .map(function (d) {
        return d.username;
      }));

    //assign the transition to the sort function
    var transition = svg.transition().duration(1500);
    transition.selectAll(".bar")
      .attr("x", function (d) {
        return scaleX(d.username);
      })

    transition.select(".x.axis")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
  });
});
