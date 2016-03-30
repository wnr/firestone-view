var http = require("http");

var ids = require("./ids-extra");

function getMinionSoundData(id, done) {
    http.get("http://www.hearthhead.com/card=" + id, function (response) {
        var body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
            body += chunk;
        });
        response.on("end", () => {
            if (body.indexOf("<title>Error") !== -1) {
                done(null);
                return;
            }

            var minion = {
                name: null,
                playSoundUrl: null,
                attackSoundUrl: null,
                deathSoundUrl: null,
                triggerSoundUrl: null
            };

            function getName(body) {
                var startIndex = body.indexOf("<title>");
                var index = body.indexOf(" - Card - Hearthstone</title>");
                return body.substring(startIndex + 7, index);
            }

            minion.name = getName(body);

            var soundMatches = body.match(/wow.zamimg.com\/hearthhead\/sounds\/[^\.]+.ogg/g);

            if (!soundMatches) {
                done(null);
                return;
            }

            soundMatches.forEach((match) => {
                if (match.match(/play/i)) {
                    minion.playSoundUrl = match;
                } else if (match.match(/attack/i)) {
                    minion.attackSoundUrl = match;
                } else if (match.match(/death/i)) {
                    minion.deathSoundUrl = match;
                } else if (match.match(/trigger/i)) {
                    minion.triggerSoundUrl = match;
                }
            });

            done(minion);
        });
    });
}

// getMinionSoundData(374, (m) => console.log(m));

var index = 0;
var idLimit = ids.length;

var cards = [];

function handleResponse(data) {
    if (!data) {
        console.error("ID: " + ids[index] + " does not exist.");
    } else {
        cards.push(data);
    }

    console.error("Read " + ids[index]);

    index++;

    if (index === idLimit) {
        console.log(JSON.stringify(cards));
        return;
    }

    getMinionSoundData(ids[index], handleResponse);
}

getMinionSoundData(ids[index], handleResponse);


// <source src="//wow.zamimg.com/hearthhead/sounds/GVG_093_TargetDummy_EnterPlay.ogg" type="audio/ogg; codecs=&quot;vorbis&quot;">
