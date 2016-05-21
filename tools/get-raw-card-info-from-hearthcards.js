// var cards = require("../asset/cards.json");
//
// console.log(cards);

var request = require("request");

var start = 1910;

var currentId = start;

function handleResponse(err, data) {
    if (err) {
        return console.error(err);
    }

    if (!data || data.length === 1) {
        return console.error("Reached end, id: " + currentId);
    }

    console.log(data);

    console.error("Read " + currentId);

    currentId++;

    getCardData(currentId, handleResponse);
}

getCardData(currentId, handleResponse);

function getCardData(id, callback) {
    var options = {
        form: {
            cardname: id
        }
        // json: true,
        // encoding: "utf8"
    };

    request.post("http://www.hearthcards.net/importer/index.php", options, function (err, response, body) {
        if (err || response.statusCode !== 200) {
            return callback(new Error("Failed", err, response.statusCode));
        }

        callback(null, body);
    });
}
