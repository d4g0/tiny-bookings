const { DateTime } = require("luxon");

// args parsing
var args = process.argv.slice(2);
var date = args[0];
var jsDate = new Date(date);
// var jsDateFromDTUTC = new Date(DateTime.fromSQL(date, { zone: 'utc' }).toString())
var jsDateFromDTUTC = DateTime.fromJSDate(jsDate, { zone: 'utc' }).toJSDate()

var d1 = new Date(Date.UTC(date));

var r = {
    jsDate: jsDate.toISOString(),
    mapDate: DateTime.fromSQL(date, { zone: 'utc' }).toString(),
    mapJSDateStr: DateTime.fromISO('2022-05-18T06:18:00.000Z', { zone: 'utc' }).toString(),
    mapFromJSDate: DateTime.fromJSDate(jsDate, { zone: 'utc' }).toString(),
    jsDateFromDTUTC: jsDateFromDTUTC.toISOString(),
    d1

}
console.log(r)