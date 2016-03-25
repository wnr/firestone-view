/* eslint-env node */

const http = require("http");
const fs = require("fs");
const path = require("path");

const cardArts = require("../src/card/card-art.json");

const assetPath = "asset-cache/";
const imagePath = assetPath + "image/";
const cardImagePath = imagePath + "card/";
const minionCardImagePath = cardImagePath + "minion/";

createDir(assetPath);
createDir(imagePath);
createDir(cardImagePath);
createDir(minionCardImagePath);

function createDir(path) {
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
}

function getHearthcardsPortraitImageUrl(minion) {
    var cardArtObj = cardArts[minion];

    if (!cardArtObj || !cardArtObj.art) {
        return null;
    }

    return "http://www.hearthcards.net/art/" + cardArtObj.art + ".png";
}

function serveFile(res, mime, filename) {
    fs.exists(filename, function(exists) {
        if(!exists) {
            console.log("File does not exist: " + filename);
            res.statusCode = 404;
            res.end();
            return;
        }

        res.setHeader("Content-Type", mime);
        const fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);
    });
}

function download(url, filename, done) {
    console.log("Downloading", url);
    http.get(url, function (hearthcardsResponse) {
        if (hearthcardsResponse.statusCode !== 200) {
            console.log("Failed to get image from hearthcards.net for ", url);
        } else {
            var targetFile = fs.createWriteStream(filename);
            hearthcardsResponse.pipe(targetFile);
            hearthcardsResponse.on("end", function () {
                console.log("Downloaded", filename);
                done(filename);
            });
        }
    }).on("error", function (err) {
        console.log(err);
    });
}

const routes = {
    GET: [{
        url: "/",
        fn: function (req, res) {
            serveFile(res, "text/html; charset=UTF-8", "src/index.html");
        }
    }, {
        url: /[.]css$/,
        fn: function (req, res) {
            const filename = path.join(process.cwd(), req.url);
            serveFile(res, "text/css; charset=UTF-8", filename);
        }
    }, {
        url: /[.]js$/,
        fn: function (req, res) {
            const filename = path.join(process.cwd(), req.url);
            serveFile(res, "text/javascript; charset=UTF-8", filename);
        }
    }, {
        url: /^\/asset\/card\/minion\//,
        fn: function (req, res) {
            const url = req.url;
            const name = decodeURIComponent(url.split("asset/card/minion/")[1]);
            const filename = path.join(process.cwd(), minionCardImagePath, name + ".png");

            fs.exists(filename, function (exists) {
                if (exists) {
                    console.log("cache hit", filename);
                    serveFile(res, "image/png", filename);
                } else {
                    console.log("cache miss", filename);
                    const url = getHearthcardsPortraitImageUrl(name);

                    if (!url) {
                        console.log("Cannot find art for", name);
                        res.statusCode = 404;
                        res.end();
                        return;
                    }

                    download(url, filename, serveFile.bind(null, res, "image/png"));
                }
            });
        }
    }, {
        url: /[.]ttf$/,
        fn: function (req, res) {
            const filename = path.join(process.cwd(), req.url);
            serveFile(res, "application/font-woff", filename);
        }
    }, {
        url: /[.]png$/,
        fn: function (req, res) {
            const filename = path.join(process.cwd(), req.url);
            serveFile(res, "image/png", filename);
        }
    }]
};

function route(method, url, fn) {
    if (!fn) {
        fn = url;
        url = method;
        method = "GET";
    }

    if (!routes[method]) {
        routes[method] = new Map();
    }

    routes[method].set(url, fn);
}

function getRoute(method, url) {
    if (!routes[method]) {
        return null;
    }

    return routes[method].find((r) => {
        if (r.url instanceof RegExp) {
            return url.match(r.url);
        }

        return r.url === url;
    });
}

http.createServer(function onRequest(request, response) {
    var url = request.url;
    var method = request.method;

    console.log(method, url);

    var route = getRoute(method, url);

    if (!route) {
        response.statusCode = 404;
        response.end();
        return;
    }

    route.fn(request, response);
}).listen(8000);
