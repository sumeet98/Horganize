
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
                 $calendar.fullCalendar('renderEvent',
                     {
                         title: title,
                         start: start,
                         end: end,
                     } ,
                     true
                 );
             };
             $calendar.fullCalendar("unselect");

             var obj = {title, start, end};
             //TO DO add the url
             $.ajax({
              //  url: url,
                type: 'POST',
                contentType:'application/json',
                data: JSON.stringify(obj),
                dataType:'json'
              });


  },
  events: function(start, end, timezone, callback) {
          var url = 'http://localhost:3000/getExampleUser';
          $.ajax({
              type : 'POST',
              url: url,
              dataType: 'json',
              success: function (doc) {
                  var events = [];
                  for(var i = 0; i < doc.appointments.length; ++i){
                      events.push({
                        title: doc.appointments[i].title,
                        start: doc.appointments[i].start,
                        end: doc.appointments[i].end
                          });
                      }
                    callback(events);

                }
  });
  }
});
});
