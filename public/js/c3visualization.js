(function() {
  $.getJSON( '/igMediaCounts')
    .done(function( data ) {
      var yCounts = data.users.map(function(item){
        return item.counts.media;
      });

      var yCounts2 = data.users.map(function(item){
        return item.counts.followed_by;
      });
      
      yCounts.unshift('Media Count');
      yCounts2.unshift('Number of Followers');

      var chart = c3.generate({
        bindto: '#chart',
        data: {
          columns: [
            yCounts,
            yCounts2
          ]
        },
        tooltip: {
          format: {
            title: function (d) {
              return data.users[d].username;
            }
          }
        }
      });
    });
})();
