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

function isInDiscoverState(gameState) {
    return isInBlockingState(gameState) && gameState.gameBlocker.type === "discover";
}

function isCard(entity) {
    return entity.type === "minion" || entity.type === "spell" || entity.type === "weapon";
}

export {
    isInBlockingState,
    isInChooseOneState,
    isInDiscoverState,
    getPlayerById,
    isCard
};
