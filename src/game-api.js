export function createGame(callback) {
    ajax("createGame", null, callback);
}

export function endTurn(data, callback) {
    ajax("endTurn", data, callback);
}

export function attack(data, callback) {
    ajax("attack", data, callback);
}

export function playMinionCard(gameId, cardId, position, targetId, callback) {
    var data = {
        gameId: gameId,
        cardId: cardId,
        position: position
    };
    if (targetId) { data.targetId = targetId; }
    ajax("playMinionCard", data, callback);
}

export function playCard(gameId, cardId, targetId, callback) {
    ajax("playCard", {
        gameId: gameId,
        cardId: cardId,
        targetId: targetId
    }, callback);
}

function ajax(action, data, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                callback(null, JSON.parse(httpRequest.responseText));
            } else {
                console.error("failed.");
                callback(new Error("Status code " + httpRequest.status));
            }
        }
    };

    httpRequest.open("POST", "http://" + document.domain + ":8001/" + action, true);
    httpRequest.send(JSON.stringify(data));
}
