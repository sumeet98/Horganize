
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
                 var obj = {title: title, start: start,end: end};

                  $.post("/addAppointment",{
                    data: JSON.stringify(obj)
                  },
                    function (data) {
                      if (data === true) {
                        console.log('Appointment saved');
                      } else {
                        console.log('Appointment could not be saved');
                      }
                    }
                  );
             };
             $calendar.fullCalendar("unselect");



  },
  events: function(start, end, timezone, callback) {
          var url = '/getAppointments';
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
