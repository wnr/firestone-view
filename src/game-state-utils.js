export function getPlayerById(gameState, playerId) {
    for (let i = 0; i < gameState.players.length; i++) {
        if (gameState.players[i].id === playerId) {
            return gameState.players[i];
        }
    }
}
