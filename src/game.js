import React from "react";
import ReactDOM from "react-dom";

import Hand from "./hand";
import Hero from "./hero";
import Battlefield from "./battlefield";
import * as api from "./game-api";
import { getPlayerById } from "./game-state-utils";

var history = [];
var historyBackSteps = 0;

export default React.createClass({
    getInitialState: function () {
        return {
            error: false,
            game: null,
            selectedMinion: null,
            selectedCard: null,
            selectedPosition: null,
            bottomPlayerInTurn: true
        };
    },
    componentDidMount: function () {
        const thisComponent = this;

        api.createGame((err, game) => {
            if (err) {
                this.setState({
                    error: true
                });
                return;
            }

            thisComponent.resetGameState({
                game: game
            });
        });
    },
    render: function () {
        const imageProvider = this.props.imageProvider;

        const game = this.state.game;

        if (!game) {
            if (this.state.error) {
                return <strong>Failed to connect to game server</strong>;
            }

            return <div></div>;
        }

        const friendlyPlayer = game.players[0];
        const opponentPlayer = game.players[1];

        return (
            <div className="container">
                <div className="game" style={{paddingTop: "16px"}}>
                    <div className="side opponent">
                        <Hand imageProvider={imageProvider}
                              cards={opponentPlayer.hand}
                              onCardClick={this.onCardClick}
                              selectedCard={this.state.selectedCard}
                        />
                        <Hero imageProvider={imageProvider}
                              hero={opponentPlayer.hero}
                              selectedMinion={this.state.selectedMinion}
                              onHeroClick={this.onHeroClick}
                              selectedCard={this.state.selectedCard}
                        />
                    </div>
                    <Battlefield
                        showPositions={this.state.selectedCard}
                        bottomPlayerInTurn={this.state.game.playerInTurn === friendlyPlayer.id}
                        imageProvider={imageProvider}
                        topMinions={opponentPlayer.activeMinions}
                        bottomMinions={friendlyPlayer.activeMinions}
                        onBattlefieldClick={this.onBattlefieldClick}
                        onPositionClick={this.onPositionClick}
                        onMinionClick={this.onMinionClick}
                        selectedMinion={this.state.selectedMinion}
                        selectedCard={this.state.selectedCard}
                        selectedPosition={this.state.selectedPosition}
                    />
                    <div className="side friendly">
                        <Hero imageProvider={imageProvider}
                              hero={friendlyPlayer.hero}
                              selectedMinion={this.state.selectedMinion}
                              onHeroClick={this.onHeroClick}
                              selectedCard={this.state.selectedCard}
                        />
                        <Hand imageProvider={imageProvider} cards={friendlyPlayer.hand}
                              onCardClick={this.onCardClick}
                              selectedCard={this.state.selectedCard}
                        />
                    </div>
                    <div className="buttons-container">
                        <button className="button" onClick={this.endTurn}>End turn</button>
                        <button className="button" onClick={this.undoInHistory}>Undo</button>
                        <button className="button" onClick={this.doInHistory}>Do</button>
                    </div>
                </div>
            </div>
        );
    },
    minionAttack: function (data) {
        this.props.audioHandler.playMinionAttack(this.state.selectedMinion.name);
        api.attack(data, (err, game) => {
            this.resetGameState({ game: game });
        });
    },
    playMinionCard: function (data) {
        this.props.audioHandler.playMinionPlayedToBoard(this.state.selectedCard.name);
        api.playMinionCard(data, (err, game) => {
            this.resetGameState({ game: game });
        });
    },
    endTurn: function () {
        this.props.audioHandler.play("ALERT_YourTurn_0v2.ogg");

        const game = this.state.game;
        const data = {
            gameId: game.id,
            playerId: game.playerInTurn
        };

        api.endTurn(data, (err, game) => {
            this.resetGameState({ game: game });
        });
    },
    undoInHistory: function () {
        historyBackSteps = Math.min(historyBackSteps + 1, history.length - 1);
        this.resetState();
    },
    doInHistory: function () {
        historyBackSteps = Math.max(historyBackSteps - 1, 0);
        this.resetState();
    },
    onCardClick: function (card) {
        if (!card.playable) {
            console.log("Card not playable");
            return;
        }

        if (this.state.selectedCard && this.state.selectedCard.id === card.id) {
            this.resetState();
        } else {
            this.resetState({
                selectedCard: card
            });
        }
    },
    onBattlefieldClick: function () {
        const card = this.state.selectedCard;
        if (card && !card.isTargeting && card.type === "SPELL") {
            api.playCard({
                gameId: this.state.game.id,
                cardId: card.id
            }, (err, game) => {
                this.resetGameState({ game: game });
            });
        }
    },
    onPositionClick: function (position) {
        if (this.state.selectedCard.isTargeting && this.state.selectedCard.validTargetIds.length) {
            this.setState({
                selectedPosition: position
            });
        } else {
            this.playMinionCard({
                gameId: this.state.game.id,
                cardId: this.state.selectedCard.id,
                position: position
            });
        }
    },
    onHeroClick: function (hero) {
        const selectedMinion = this.state.selectedMinion;
        const selectedCard = this.state.selectedCard;
        if (selectedMinion && (selectedMinion.validAttackIds.indexOf(hero.id) >= 0)) {
            this.minionAttack({
                        gameId: this.state.game.id,
                        attackerId: selectedMinion.id,
                        targetId: hero.id
                    });
        } else if (selectedCard && selectedCard.isTargeting && selectedCard.validTargetIds.indexOf(hero.id) !== -1) {
            if (selectedCard.type === "SPELL") {
                api.playCard({
                    gameId: this.state.game.id,
                    cardId: selectedCard.id,
                    targetId: hero.id
                }, (err, game) => {
                    this.resetGameState({ game: game });
                });
            } else {
                this.playMinionCard({
                    gameId: this.state.game.id,
                    cardId: selectedCard.id,
                    position: this.state.selectedPosition,
                    targetId: hero.id
                });
            }
        }
    },
    onMinionClick: function (minion) {
        if (this.state.selectedMinion) {
            if (this.state.selectedMinion.id === minion.id) {
                this.resetState();
            } else if ((this.state.selectedMinion.validAttackIds.indexOf(minion.id) >= 0)) {
                // Minion attacks a minion
                this.minionAttack({
                    gameId: this.state.game.id,
                    attackerId: this.state.selectedMinion.id,
                    targetId: minion.id
                });
            }
        } else if (this.state.selectedCard) {
            if (this.state.selectedPosition !== null) {
                // Targeting card is being played on the given minion as target.
                this.playMinionCard({
                    gameId: this.state.game.id,
                    cardId: this.state.selectedCard.id,
                    position: this.state.selectedPosition,
                    targetId: minion.id
                });
            } else if (this.state.selectedCard.type === "SPELL"
                        && this.state.selectedCard.isTargeting
                        && (this.state.selectedCard.validTargetIds.indexOf(minion.id) >= 0)) {
                api.playCard({
                    gameId: this.state.game.id,
                    cardId: this.state.selectedCard.id,
                    targetId: minion.id
                }, (err, game) => {
                    this.resetGameState({ game: game });
                });
            } else {
                console.error("Invalid state");
            }
        } else if (minion.canAttack) {
            // Minions is selected for attacking
            this.resetState({
                selectedMinion: minion
            });
        }
    },
    resetState: function (state) {
        var newState;
        if (historyBackSteps === 0) {
            newState = history[history.length - 1 - historyBackSteps];
            newState.selectedMinion =  null;
            newState.selectedCard = null;
            newState.selectedPosition = null;

            for (var prop in state) {
                if (state.hasOwnProperty(prop)) {
                    newState[prop] = state[prop];
                }
            }
        } else {
            newState = history[history.length - 1 - historyBackSteps];
            newState.selectedMinion =  null;
            newState.selectedCard = null;
            newState.selectedPosition = null;
        }

        this.setState(newState);
    },
    resetGameState: function (game) {
        var that = this;

        var intermediateStates = game.game.intermediateStates;

        var setStateWithDelay = function (index) {

            var s;
            if (intermediateStates[index]) {
                that.props.audioHandler.playMinionTrigger(intermediateStates[index].entityName);
                s = {game: intermediateStates[index].state};
            } else {
                s = game;
            }

            var newState = {
                selectedMinion: null,
                selectedCard: null,
                selectedPosition: null
            };

            for (var prop in s) {
                if (s.hasOwnProperty(prop)) {
                    newState[prop] = s[prop];
                }
            }

            history.push(newState);

            that.setState(newState, function () {
                if (s !== game) {
                    setTimeout(function () {
                        index = index + 1;
                        setStateWithDelay(index);
                    }, 1000);
                }
            });
        };

        setStateWithDelay(0);
    }
});
