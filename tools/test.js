/* eslint-env node */

var cards = require("./cards.json");

var filteredInfo = cards.reduce((a, card) => {
    a[card.name] = {
        art: card.art,
        name: card.name,
        id: card.cardid
    };
    return a;
}, {}, cards);

console.log(JSON.stringify(filteredInfo));
