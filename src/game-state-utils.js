function getPlayerById(gameState, playerId) {
    for (let i = 0; i < gameState.players.length; i++) {
        if (gameState.players[i].id === playerId) {
            return gameState.players[i];
        }
    }
}

function isInBlockingState(gameState) {
    return !!gameState.gameBlocker;
}

function isInChooseOneState(gameState) {
    return isInBlockingState(gameState) && gameState.gameBlocker.type === "choose-one";
}

export {
    isInBlockingState,
    isInChooseOneState,
    getPlayerById
};
