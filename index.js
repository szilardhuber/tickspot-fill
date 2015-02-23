var nomnom = require("nomnom");
var request = require("request");
var http = require("http");
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
    project: {
        full: 'project',
        abbr: 'p',
        default: '6771643',
        help: 'the id of the project'
    },
    authToken: {
        full: 'token',
        abbr: 't',
        help: 'the authorization token',
        required: true
    },
    email: {
        full: 'email',
        abbr: 'e',
        help: 'e-mail address',
        required: true
    }
}

var options = nomnom.options(CLI_OPTIONS).parse();

var createEntry = function (date, options) {
    var url = "https://www.tickspot.com/12420/api/v2/entries.json"
    var headers = {
        "Authorization": "Token token=" + options["authToken"],
        "User-Agent": "tickspot-fill " + options["email"]
    }
    var data = {
        "date": date,
        "hours": 8,
        "notes": "",
        "task_id": options["project"],
    }

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

date = new Date(options["year"], options["month"] - 1, 1);
var month = date.getMonth();
while(date.getMonth() === month) {
    weekDay = date.getDay()
    if (weekDay !== 0 && weekDay !== 6) {
        dateToPost = year + "-" + (month+1) + "-" + date.getDate();
        createEntry(dateToPost, options);
    }
    date.setDate(date.getDate() + 1)
}