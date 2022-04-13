// make a utility for get dates in a table from a comands like
// gendates 1 2 3 4 5
// where params will be days offset from today
const { DateTime } = require("luxon");

// args parsing
var args = process.argv.slice(2);
// mapping to numbers
var days = mapStrToNumbers(args);
// print table
printDates(days);


function printDates(days = []) {
    var dates = [];
    for (let i = 0; i < days.length; i++) {
        var dayDate = todayPlus(days[i]).toString();
        dates.push({
            offset: days[i],
            date: dayDate
        });
    }

    console.table(dates);
}

function todayPlus(days = 0) {
    var c_utc = currentUTC();
    var plusDaysDate = DateTime.fromObject({
        year: c_utc.year,
        month: c_utc.month,
        day: c_utc.day + days
    }, { zone: 'utc' });

    return plusDaysDate;
}

function currentUTC() {
    return DateTime.now().toUTC();
}

function mapStrToNumbers(str = []) {
    return str.map(s => Number.parseInt(s));
}

