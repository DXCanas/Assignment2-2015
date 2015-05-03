var bleed = 100,
  width = 960,
  height = 760;

var pack = d3.layout.pack()
  .sort(null)
  .size([width, height + bleed * 2])
  .padding(2);

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(0," + -bleed + ")");

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

d3.json('/igMediaCounts', function (error, json) {
  var node = svg.selectAll("#chart")
    .data(pack.nodes(flatten(json))
      .filter(function (d) {
        //console.log(d);
        return !d.children;
      }))
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      console.log(d.x + d.y);
      return "translate(" + d.x + "," + d.y + ")";
    });

  node.append("circle")
    .attr("r", function (d) {
      return d.r;
    })
    .on('mouseover', function (d) {
      tip.show(d.name +'<br /><img src="'+d.profilePic+'">');
    })
    .on('mouseout', tip.hide);

  /*node.append("text")
    .text(function (d) {
      return d.name;
    })
    .style("font-size", function (d) {
      return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 24) + "px";
    })
    .style("color", "red")
    .attr("dy", ".35em");*/
}); 
  

// Returns a flattened hierarchy containing all leaf nodes under the root.
function flatten(root) {
  
  console.log(root);

  var userAndLikes = [];
  
  root.userRecent.map(function(innerArray) { 
    userAndLikes.push({
      name: innerArray.user.username,
      value: innerArray.likes.count,
      profilePic: innerArray.user.profile_picture
    });
  });

  return {
    children: userAndLikes
  };
}

d3.select(self.frameElement).style("height", height + "px");