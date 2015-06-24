var nomnom = require("nomnom");
var request = require("request");
now = new Date();
CLI_OPTIONS = {
    year: {
        full: 'year',
        abbr: 'y',
        help: 'Target year',
        default: now.getFullYear(),
    },
    month: {
        full: 'month',
        abbr: 'm',
        help: 'Target month',
        default: now.getMonth() + 1,
    },
    task: {
        full: 'task',
        abbr: 't',
        default: '6771643',
        help: 'the id of the task. This can be found by hovering the mouse over the given task on Tickspot GUI.'
    },
    authToken: {
        full: 'auth',
        abbr: 'a',
        help: 'the API authorization token. This can be found at: https://tickspot.com/users',
        required: true
    },
    email: {
        full: 'email',
        abbr: 'e',
        help: 'Your tickspot e-mail address',
        required: true
    },
    subscription: {
        full: 'subscription',
        abbr: 's',
        help: 'Tickspot subscription id. This can be found at: https://tickspot.com/users',
        default: "12420"
    },
    hours: {
        full: 'hours',
        abbr: 'o',
        help: 'Number of worked hours',
        required: true,
        default: 8
    }
}

var options = nomnom.options(CLI_OPTIONS).parse();

var getEntry = function (date, options, callback) {
    var url = "https://www.tickspot.com/" + options["subscription"] + "/api/v2/entries.json"
    var headers = {
        "Authorization": "Token token=" + options["authToken"],
        "User-Agent": "tickspot-fill " + options["email"]
    }
    var data = {
        "start_date": date,
        "end_date": date
    }
    request({
        headers: headers,
        url: url,
        body: data,
        json: true,
        method: "GET",

    }, function(error, response, body) {
        callback(error, response, date);
    });
}

var createEntry = function (date, options) {
    var url = "https://www.tickspot.com/" + options["subscription"] + "/api/v2/entries.json"
    var headers = {
        "Authorization": "Token token=" + options["authToken"],
        "User-Agent": "tickspot-fill " + options["email"]
    }
    var data = {
        "date": date,
        "hours": options["hours"],
        "notes": "",
        "task_id": options["task"]
    };

    request({
        headers: headers,
        url: url,
        body: data,
        json: true,
        method: "POST",

    }, function(error, response, body) {
        if (error !== null) {
            console.log("Error happened:");
            console.dir(error);
        }
        if (response.statusCode === 201) {
            console.log("Entry created on date: " + date);
        } else {
            console.dir("Couldn't create entry on date: " + date);
        }
    });
}

var year = options["year"]; 
var month = options["month"] - 1;
date = new Date(year, month, 1);
while(date.getMonth() === month) {
    weekDay = date.getDay();
    if (weekDay !== 0 && weekDay !== 6) {
        var dateToGet = year + "-" + (month+1) + "-" + date.getDate();
        getEntry(dateToGet, options, function(error, response, dateToPost) {
            if (!error && response.toJSON().body.length == 0) {
                createEntry(dateToPost, options);
            }
        });
    }
    date.setDate(date.getDate() + 1);
}
