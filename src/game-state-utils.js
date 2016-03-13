export function getPlayerById(gameState, playerId) {
    for(var i = 0; i < gameState.players.length; i++) {
        if (gameState.players[i].id === playerId) {
            return gameState.players[i];
        }
    }
}
