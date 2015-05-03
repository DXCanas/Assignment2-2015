(function() {
  $.getJSON( '/igMediaCounts')
    .done(function( data ) {
      var yCounts = data.users.map(function(item){
        return item.counts.follows;
      });

      var yCounts2 = data.users.map(function(item){
        return item.counts.followed_by;
      });
      
      yCounts.unshift('# of People Followed');
      yCounts2.unshift('Number of Followers');

      var chart = c3.generate({
        bindto: '#chart',
        data: {
          columns: [
            yCounts,
            yCounts2
          ],
          type:'spline'
        },
        tooltip: {
          format: {
            title: function (d) {
              return data.users[d].username;
            }
          }
        },
        axis: {
          x: {
            show: false
          }
        }
      });
    });
})();
