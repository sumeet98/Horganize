window.onload = function() {
  //Copyright 1996 - Tomer and Yehuda Shiran
  //Feel free to "steal" this code provided that you leave this notice as is.

  //^^^^ I CHANGED MOST OF IT UP USED THEIR TEMPLATE ONLY


  setCal()


  function leapYear(year) {
  if (year % 4 == 0)
  return true
  return false
  }

  function getDays(month, year) {
  var ar = new Array(12)
  ar[0] = 31
  ar[1] = (leapYear(year)) ? 29 : 28
  ar[2] = 31
  ar[3] = 30
  ar[4] = 31
  ar[5] = 30
  ar[6] = 31
  ar[7] = 31
  ar[8] = 30
  ar[9] = 31
  ar[10] = 30
  ar[11] = 31

  return ar[month]
  }

  function getMonthName(month) {
  var ar = new Array(12)
  ar[0] = "January"
  ar[1] = "February"
  ar[2] = "March"
  ar[3] = "April"
  ar[4] = "May"
  ar[5] = "June"
  ar[6] = "July"
  ar[7] = "August"
  ar[8] = "September"
  ar[9] = "October"
  ar[10] = "November"
  ar[11] = "December"

  return ar[month]
  }

  function setCal() {
  var now = new Date()
  var year = now.getYear()
  if (year < 1000)
  year+=1900
  var month = now.getMonth()
  var monthName = getMonthName(month)
  var date = now.getDate()
  now = null

  var firstDayInstance = new Date(year, month, 1)
  var firstDay = firstDayInstance.getDay()
  firstDayInstance = null

  var days = getDays(month, year)

  drawCal(firstDay + 1, days, date, monthName, year)
  }

  function drawCal(firstDay, lastDate, date, monthName, year) {
  // constant table settings
  var headerHeight = 50 // height of the table's header cell
  var border = 2 // 3D height of table's border
  var cellspacing = 4 // width of table's border
  var headerColor = "black" // color of table's header
  var headerSize = "+3" // size of tables header font
  var colWidth = 60 // width of columns in table
  var dayCellHeight = 25 // height of cells containing days of the week
  var dayColor = "black" // color of font representing week days
  var cellHeight = 40 // height of cells representing dates in the calendar
  var todayColor = "red" // color specifying today's date in the calendar


  // create basic table structure
  var text = "" // initialize accumulative variable to empty string
  text += '<CENTER>'
  text += '<TABLE BORDER=' + border + ' CELLSPACING=' + cellspacing + '>' // table settings
  text += '<TH COLSPAN=7 HEIGHT=' + headerHeight + '>' // create table header cell
  text += '<FONT COLOR="' + headerColor + '" SIZE=' + headerSize + '>' // set font for table header
  text += monthName + ' ' + year
  text += '</FONT>' // close table header's font settings
  text += '</TH>' // close header cell

  // variables to hold constant settings
  var openCol = '<TD WIDTH=' + colWidth + ' HEIGHT=' + dayCellHeight + '>'
  openCol += '<FONT COLOR="' + dayColor + '">'
  var closeCol = '</FONT></TD>'

  // create array of abbreviated day names
  var weekDay = new Array(7)
  weekDay[0] = "Sun"
  weekDay[1] = "Mon"
  weekDay[2] = "Tues"
  weekDay[3] = "Wed"
  weekDay[4] = "Thu"
  weekDay[5] = "Fri"
  weekDay[6] = "Sat"

  // create first row of table to set column width and specify week day
  text += '<TR ALIGN="center" VALIGN="center">'
  for (var dayNum = 0; dayNum < 7; ++dayNum) {
  text += openCol + weekDay[dayNum] + closeCol
  }
  text += '</TR>'

  // declaration and initialization of two variables to help with tables
  var digit = 1
  var curCell = 1

  for (var row = 1; row <= Math.ceil((lastDate + firstDay - 1) / 7); ++row) {
  text += '<TR ALIGN="right" VALIGN="top">'
  for (var col = 1; col <= 7; ++col) {
  if (digit > lastDate)
  break
  if (curCell < firstDay) {
  text += '<TD></TD>';
  curCell++
  } else {
  if (digit == date) { // current cell represent today's date
  text += '<TD HEIGHT=' + cellHeight + '>'
  text += '<FONT COLOR="' + todayColor + '">'
  text += digit
  text += '</FONT><BR>'
  text += '</FONT>'
  text += '</TD>'
  } else
  text += '<TD HEIGHT=' + cellHeight + '>' + digit + '</TD>'
  digit++
  }
  }
  text += '</TR>'
  }

  // close all basic table tags
  text += '</TABLE>'
  text += '</CENTER>'

  // print accumulative HTML string
  document.write(text)
}
}
