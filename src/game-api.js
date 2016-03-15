export function createGame(callback) {
    ajax("createGame", null, callback);
}

export function endTurn(data, callback) {
    ajax("endTurn", data, callback);
}

export function attack(data, callback) {
    ajax("attack", data, callback);
}

/**
 * data: {gameId, cardId, position, [targetId]}
 */
export function playMinionCard(data, callback) {
    ajax("playMinionCard", data, callback);
}

export function playCard(data, callback) {
    ajax("playCard", data, callback);
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
