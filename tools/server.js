/* eslint-env node */

const http = require("http");
const fs = require("fs");
const path = require("path");

const cardArts = require("./card-art.json");
const soundData = require("./sound-data-2016-04.json").concat(require("./sound-data-extra.json"));

const assetPath = "asset-cache/";
const imagePath = assetPath + "image/";
const cardImagePath = imagePath + "card/";
const minionCardImagePath = cardImagePath + "minion/";
const spellCardImagePath = cardImagePath + "spell/";
const weaponImagePath = imagePath + "weapon/";
const soundPath = assetPath + "sound/";
const minionSoundPath = soundPath + "minion/";

createDir(assetPath);
createDir(imagePath);
createDir(cardImagePath);
createDir(minionCardImagePath);
createDir(spellCardImagePath);
createDir(weaponImagePath);
createDir(soundPath);
createDir(minionSoundPath);

function createDir(path) {
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
}

function getHearthcardsPortraitImageUrl(minion) {
    var cardArtObj = cardArts[minion];

    if (minion === 'Dr. Boom') { cardArtObj = {art: 'hs3-068_d'}; } // Why doesn't it work?

    if (!cardArtObj || !cardArtObj.art) {
        return null;
    }

    return "http://www.hearthcards.net/art/" + cardArtObj.art + ".png";
}

function getHearthheadSoundUrl(audioFileName) {
    if (audioFileName.indexOf("Play.ogg") >= 0) {
        var minionName = audioFileName.split("Play.ogg")[0].replace(/'/g, "&#039;");
        var data = soundData.filter(function (data) {
            return data.name === minionName;
        })[0];
        if (data) {
            return "http://" + data.playSoundUrl;
        }
        return;
    } else if (audioFileName.indexOf("Attack.ogg") >= 0) {
        var minionName = audioFileName.split("Attack.ogg")[0].replace(/'/g, "&#039;");
        var data = soundData.filter(function (data) {
            return data.name === minionName;
        })[0];
        if (data) {
            return "http://" + data.attackSoundUrl;
        }
        return;
    } else if (audioFileName.indexOf("Trigger.ogg") >= 0) {
        var minionName = audioFileName.split("Trigger.ogg")[0].replace(/'/g, "&#039;");
        var data = soundData.filter(function (data) {
            return data.name === minionName;
        })[0];
        if (data) {
            return "http://" + data.triggerSoundUrl;
        }
        return;
    }
}

function serveFile(res, mime, filename) {
    if (filename) {
        fs.exists(filename, function (exists) {
            if (!exists) {
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
}

function download(url, filename, done) {
    console.log("Downloading", url);
    http.get(url, function (hearthcardsResponse) {
        if (hearthcardsResponse.statusCode !== 200) {
            console.log("Failed to get asset from hearthcards.net for ", url);
            done(null);
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
        done(null);
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
        url: /^\/asset\/image\/card\/minion\//,
        fn: function (req, res) {
            const url = req.url;
            const name = decodeURIComponent(url.split("asset/image/card/minion/")[1]);
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
        url: /^\/asset\/image\/card\/spell\//,
        fn: function (req, res) {
            const url = req.url;
            const name = decodeURIComponent(url.split("asset/image/card/spell/")[1]);
            const filename = path.join(process.cwd(), spellCardImagePath, name + ".png");

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
        url: /^\/asset\/image\/weapon\//,
        fn: function (req, res) {
            const url = req.url;
            const name = decodeURIComponent(url.split("asset/image/weapon/")[1]);
            const filename = path.join(process.cwd(), weaponImagePath, name + ".png");

            console.log(name, filename);

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
        url: /^\/asset\/image\/card\//,
        fn: function (req, res) {
            function getHearthcardUrl(name) {
                var mapper = {
                    "minion frame neutral": "card_js_templates/card_minion_neutral.png",
                    "minion frame paladin": "card_js_templates/card_minion_paladin.png",
                    "minion frame warlock": "card_js_templates/card_minion_warlock.png",
                    "minion frame hunter": "card_js_templates/card_minion_hunter.png",
                    "minion frame mage": "card_js_templates/card_minion_mage.png",
                    "minion frame priest": "card_js_templates/card_minion_priest.png",
                    "minion frame druid": "card_js_templates/card_minion_druid.png",
                    "minion frame warrior": "card_js_templates/card_minion_warrior.png",
                    "minion frame rogue": "card_js_templates/card_minion_rogue.png",
                    "minion frame shaman": "card_js_templates/card_minion_shaman.png",
                    "minion gem brackets": "card_js_templates/minion_gem_brackets.png",
                    "gem common": "card_js_templates/gem_common.png",
                    "gem rare": "card_js_templates/gem_rare.png",
                    "gem epic": "card_js_templates/gem_epic.png",
                    "gem legendary": "card_js_templates/gem_legendary.png",
                    "minion frame dragon bracket": "card_js_templates/card_minion_legendary_dragon_bracket.png",
                    "minion swirl blackrock": "card_js_templates/on_card_swirl_blackrock_minion.png",
                    "minion race": "card_js_templates/card_race.png",
                    "spell frame neutral": "card_js_templates/card_spell_neutral.png",
                    "spell frame paladin": "card_js_templates/card_spell_paladin.png",
                    "spell frame warlock": "card_js_templates/card_spell_warlock.png",
                    "spell frame hunter": "card_js_templates/card_spell_hunter.png",
                    "spell frame mage": "card_js_templates/card_spell_mage.png",
                    "spell frame priest": "card_js_templates/card_spell_priest.png",
                    "spell frame druid": "card_js_templates/card_spell_druid.png",
                    "spell frame warrior": "card_js_templates/card_spell_warrior.png",
                    "spell frame rogue": "card_js_templates/card_spell_rogue.png",
                    "spell frame shaman": "card_js_templates/card_spell_shaman.png",
                    "spell gem brackets": "card_js_templates/spell_gem_brackets.png",
                    "spell swirl basic": "card_js_templates/on_card_swirl_basic_spell.png"
                };

                var suburl = mapper[name];

                if (!suburl) {
                    return null;
                }

                return "http://www.hearthcards.net/" + suburl;
            }

            const url = req.url;
            const name = decodeURIComponent(url.split("asset/image/card/")[1]);
            const hearthcardsUrl = getHearthcardUrl(name);

            if (!hearthcardsUrl) {
                console.log("Unknown card image:", name);
                res.statusCode = 404;
                res.end();
                return;
            }

            const filename = path.join(process.cwd(), cardImagePath, name + ".png");

            fs.exists(filename, function (exists) {
                if (exists) {
                    console.log("cache hit", filename);
                    serveFile(res, "image/png", filename);
                } else {
                    console.log("cache miss", filename);
                    download(hearthcardsUrl, filename, serveFile.bind(null, res, "image/png"));
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
        url: /^\/asset\/sound\/minion\//,
        fn: function (req, res) {
           function getCachedFilename(filenames, callback) {
                const filename = filenames[0];

                if (!filename) {
                    return callback(null);
                }

                fs.exists(filename, function (exists) {
                    if (exists) {
                        callback(filename);
                    } else {
                        getCachedFilename(filenames.slice(1), callback);
                    }
                });
            }

            function downloadFileFromExternalUrl(filenames, callback) {
                const filename = filenames[0];
                console.log("FILENAME:", filename);
                if (filename) {
                    const fileType = filename.substring(filename.length - 4, filename.length);
                    console.log("THE FILE TYPE IS", fileType);

                    if (!filename) {
                        return callback(null);
                    }

                    console.log("FILENAME:", filename);
                    const name = decodeURIComponent(filename.split("sound/minion/")[1]);
                    console.log("NAME:", name.replace(".mp3", ".ogg"));
                    const preUrl = getHearthheadSoundUrl(name.replace(".mp3", ".ogg"));

                    console.log('Trying to download from:', preUrl);

                    if (!preUrl) {
                        console.log("WARNING: Cannot find sound url for", name);
                        downloadFileFromExternalUrl(filenames.slice(1), callback);
                        return;
                    }

                    const url = preUrl.replace(".ogg", fileType);

                    download(url, filename, function (f) {
                        console.log('DONE WITH DOWNLOAD');
                        if (!f) {
                            console.log('RECUR');
                            downloadFileFromExternalUrl(filenames.slice(1), callback);
                        } else {
                            callback(filename);
                        }
                    });
                } else {
                    callback(null);
                }
            }

            function prepareResponse(res, filename) {
                if (filename.indexOf(".ogg") !== -1) {
                    serveFile(res, "application/audio/ogg", filename);
                } else {
                    serveFile(res, "application/audio/mp3", filename);
                }
            }

            const url = req.url;
            const name = decodeURIComponent(url.split("asset/sound/minion/")[1]);
            const filenames = [
                path.join(process.cwd(), minionSoundPath, name + ".ogg"),
                path.join(process.cwd(), minionSoundPath, name + ".mp3")
            ];

            getCachedFilename(filenames, function (filenameInCache) {
                if (filenameInCache) {
                    console.log("cache hit", filenameInCache);
                    prepareResponse(res, filenameInCache);
                } else {
                    console.log("cache miss", filenames);
                    downloadFileFromExternalUrl(filenames, function (downloadedFilename) {
                        if (downloadedFilename) {
                            console.log("Downloaded sound", downloadedFilename);
                            prepareResponse(res, downloadedFilename);
                        } else {
                            res.statusCode = 404;
                            res.end();
                        }
                    });
                }
            });
        }
    }, {
        url: /[.]ogg$/,
        fn: function (req, res) {
            const filename = path.join(process.cwd(), req.url);
            serveFile(res, "application/audio/ogg", filename);
        }
    }, {
        url: /[.]png$/,
        fn: function (req, res) {
            const filename = path.join(process.cwd(), decodeURIComponent(req.url));
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

console.log("Listening on http://localhost:8000/");
