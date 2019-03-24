$(document).ready(function() {
  var $calendar = $('#calendar').fullCalendar({
      header: {
        left: 'prev,next',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      selectable: true,
      editable: true,
      select: function(start, end, jsEvent, view) {
           var title = prompt("Enter a title for this event", "New event");

           if (title) {
             var event = {
               title: title,
               start: start,
               end: end,
             };

             $calendar.fullCalendar("renderEvent", event, false);
           };
           $calendar.fullCalendar("unselect");
        },
    events: function(start, end, timezone, callback) {
        var url = 'http://localhost:3000/getExampleUser';
        $.ajax({
            type : 'GET',
            url: url,
            dataType: 'json',
            data: {
              start: start.format(),
              end: end.format()
            },
            success: function (doc) {
                var events = [];
                if(!!doc.result){
                  $.map(doc.result, function(r){
                    events.push({
                      title: r.name,
                      start: r.start,
                      end: r.end
                    });
                  });
                }
                callback(events);
              }

});
}
});
});
