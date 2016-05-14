/*eslint-env node */

const request = require("request");
const fs = require("fs");

const outFilename = process.argv[2];

if (!outFilename) {
    throw new Error("outfile argument required! Usage: 'node tools/update-card-art.js tools/card-art.json'");
}

function getAllCardData(cb) {
    var cardDatas = [];

    function handleResponse(err, id, data) {
        if (err) {
            return console.error(err);
        }

        if (!data) {
            console.log("Reached end, id: " + id);
            console.log("===");
            return cb(cardDatas);
        }

        cardDatas.push(data);

        console.log("Read " + id + " " + data.name);

        getCardData(id + 1, handleResponse);
    }

    function getCardData(id, callback) {
        var options = {
            form: {
                cardname: id
            },
            json: true,
            encoding: "utf8"
        };

        request.post("http://www.hearthcards.net/importer/index.php", options, function (err, response, body) {
            if (err || response.statusCode !== 200) {
                return callback(new Error("Failed", err, response.statusCode));
            }

            callback(null, id, body);
        });
    }

    var start = 1;
    var currentId = start;

    getCardData(currentId, handleResponse);
}

getAllCardData(function (cardDatas) {
    const reducedCardDatas = {};

    cardDatas.forEach((cd) => {
        if (reducedCardDatas[cd.name]) {
            // Some cards have the same name, but only one of them have arts defined.
            if (reducedCardDatas[cd.name].art) {
                return;
            }
        }

        reducedCardDatas[cd.name] = {
            art: cd.art,
            name: cd.name,
            id: cd.cardid
        };
    });

    console.log("Writing to " + outFilename);

    fs.writeFileSync(outFilename, JSON.stringify(reducedCardDatas, null, 4));
});
