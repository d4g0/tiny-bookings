
var input = { year: 2022, month: 4, day: 18, hour: 5, minute: 43 };
var date = utcDate(input);

console.log({
    input,
    date: date.toISOString()
})


function utcDate({
    year = 0,
    month = 0,
    day = 0,
    hour = 0,
    minute = 0,
}) {
    return new Date(Date.UTC(
        year, month, day, hour, minute
    ));
}