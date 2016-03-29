var http = require("http");

function getCardIds(offset, done) {
    http.get("http://www.hearthhead.com/cards#gallery:" + offset, function (response) {
        var body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
            body += chunk;
        });
        response.on("end", () => {
            var idMatches = body.match(/{"id":\d+,"image":/g);
            var ids = [];
            idMatches.forEach((match) => {
                var endIndex = match.indexOf(",");
                ids.push(match.substring(6, endIndex));
            });

            done(ids);
        });
    });
}

var offset = 0;

function handleResponse(data) {
    console.log(JSON.stringify(data));
    return;
};

getCardIds(offset, handleResponse);
