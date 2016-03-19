/* eslint-env node */

var assert = require("assert");

var data = "";

process.stdin.on("readable", () => {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        var str = chunk.toString("utf8");
        data += str;
    }
});

process.stdin.on("end", () => {
    var lines = data.split("\n");

    var objs = lines.map((l) => {
        var re = /[^\w{}:\", \\\d/]/gi;
        var strippedLine = l.replace(re, "");
        if (strippedLine) {
            return JSON.parse(strippedLine);
        }
    }).filter((o) => o);

    console.log(JSON.stringify(objs));
});
