import React from "react";

import * as api from "./game-api";
import * as stateUtils from "./game-state-utils";

import Hand from "./hand";
import Hero from "./hero/hero";
import Battlefield from "./battlefield";
import ChooseOne from "./choose-one/choose-one";

var history = [];
var historyBackSteps = 0;

export default React.createClass({
    getInitialState: function () {
        return {
            error: false,
            game: null,
            selectedCharacter: null,
            selectedCard: null,
            selectedPosition: null,
            selectedHeroPower: null,
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
        const intermediateStateInfo = this.state.intermediateStateInfo;
        const game = this.state.game;

        if (!game) {
            if (this.state.error) {
                return <strong>Failed to connect to game server</strong>;
            }

            return <div></div>;
        }

        const friendlyPlayer = game.players[0];
        const opponentPlayer = game.players[1];

        function intermediateState () {
            if (intermediateStateInfo.entityName) {
                return (
                    <div className="states">
                        <p>Entity: {intermediateStateInfo.entityName}</p>
                        <p>Event: {intermediateStateInfo.eventName}</p>
                    </div>
                );
            }
            return (<div></div>);
        }

        return (
            <div className="container">
                <ChooseOne game={this.state.game} />
                <div className="game">
                    <div className="side opponent">
                        <div className="hand-area">
                            <Hand imageProvider={imageProvider}
                                  cards={opponentPlayer.hand}
                                  onCardClick={this.onCardClick}
                                  selectedCard={this.state.selectedCard}
                            />
                        </div>
                        <div className="hero-area">
                            <Hero imageProvider={imageProvider}
                                  hero={opponentPlayer.hero}
                                  secrets={opponentPlayer.activeSecrets}
                                  selectedCharacter={this.state.selectedCharacter}
                                  onHeroClick={this.onHeroClick}
                                  onHeroPowerClick={this.onHeroPowerClick}
                                  selectedCard={this.state.selectedCard}
                                  selectedHeroPower={this.state.selectedHeroPower}
                                  selectedPosition={this.state.selectedPosition}
                            />
                        </div>
                    </div>
                    <Battlefield
                        showPositions={this.state.selectedCard}
                        bottomPlayerInTurn={this.state.game.playerInTurn === friendlyPlayer.id}
                        topMinions={opponentPlayer.activeMinions}
                        bottomMinions={friendlyPlayer.activeMinions}
                        onBattlefieldClick={this.onBattlefieldClick}
                        onPositionClick={this.onPositionClick}
                        onMinionClick={this.onMinionClick}
                        selectedCharacter={this.state.selectedCharacter}
                        selectedCard={this.state.selectedCard}
                        selectedPosition={this.state.selectedPosition}
                        selectedHeroPower={this.state.selectedHeroPower}
                    />
                    <div className="side friendly">
                        <div className="hero-area">
                            <Hero imageProvider={imageProvider}
                                  hero={friendlyPlayer.hero}
                                  secrets={friendlyPlayer.activeSecrets}
                                  selectedCharacter={this.state.selectedCharacter}
                                  onHeroClick={this.onHeroClick}
                                  onHeroPowerClick={this.onHeroPowerClick}
                                  selectedCard={this.state.selectedCard}
                                  selectedHeroPower={this.state.selectedHeroPower}
                                  selectedPosition={this.state.selectedPosition}
                            />
                        </div>
                        <div className="hand-area">
                            <Hand imageProvider={imageProvider}
                                  cards={friendlyPlayer.hand}
                                  onCardClick={this.onCardClick}
                                  selectedCard={this.state.selectedCard}
                            />
                        </div>
                    </div>
                    <div className="buttons-container">
                        {intermediateState()}
                        <button className="button" onClick={this.onEndTurn}>End turn</button>
                        <br />
                        <button className="button" onClick={this.undoInHistory}>Back</button>
                        <br />
                        <button className="button" onClick={this.doInHistory}>Forward</button>
                    </div>
                </div>
            </div>
        );
    },
    characterAttack: function (data) {
        this.props.audioHandler.playCharacterAttack(this.state.selectedCharacter.name);
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
    playWeaponCard: function (data) {
        this.props.audioHandler.playWeaponPlayed(this.state.selectedCard.name);
        api.playWeaponCard(data, (err, game) => {
            this.resetGameState({ game: game });
        });
    },
    onEndTurn: function () {
        if (stateUtils.isInBlockingState(this.state.game)) {
            return;
        }

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
        if (stateUtils.isInBlockingState(this.state.game)) {
            return;
        }

        if (!card.playable) {
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
        if (stateUtils.isInBlockingState(this.state.game)) {
            return;
        }

        const card = this.state.selectedCard;
        if (card && !card.isTargeting && card.type === "SPELL") {
            api.playCard({
                gameId: this.state.game.id,
                cardId: card.id
            }, (err, game) => {
                this.resetGameState({ game: game });
            });
        } else if (card && !card.isTargeting && card.type === "WEAPON") {
            api.playWeaponCard({
                gameId: this.state.game.id,
                cardId: card.id
            }, (err, game) => {
                this.resetGameState({ game: game });
            });
        }
    },
    onPositionClick: function (position) {
        if (stateUtils.isInBlockingState(this.state.game)) {
            return;
        }

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
        if (stateUtils.isInBlockingState(this.state.game)) {
            return;
        }
        this.onCharacterClick(hero);
    },
    onMinionClick: function (minion) {
        if (stateUtils.isInBlockingState(this.state.game)) {
            return;
        }
        this.onCharacterClick(minion);
    },
    onCharacterClick: function (character) {
        const selectedCharacter = this.state.selectedCharacter;
        const selectedCard = this.state.selectedCard;
        if (selectedCharacter && (selectedCharacter.validAttackIds.indexOf(character.id) >= 0)) {
            // Attacking another character
            this.characterAttack({
                gameId: this.state.game.id,
                attackerId: selectedCharacter.id,
                targetId: character.id
            });
        } else if (selectedCard && selectedCard.isTargeting && selectedCard.validTargetIds.indexOf(character.id) !== -1) {
            // Some card is a targetting card and the character was selected as the target
            if (selectedCard.type === "SPELL") {
                api.playCard({
                    gameId: this.state.game.id,
                    cardId: selectedCard.id,
                    targetId: character.id
                }, (err, game) => {
                    this.resetGameState({ game: game });
                });
            } else if(selectedCard.type === "WEAPON"){
                this.playWeaponCard({
                    gameId: this.state.game.id,
                    cardId: selectedCard.id,
                    targetId: character.id
                });
            } else {
                this.playMinionCard({
                    gameId: this.state.game.id,
                    cardId: selectedCard.id,
                    position: this.state.selectedPosition,
                    targetId: character.id
                });
            }
        } else if (this.state.selectedHeroPower) {
            // Hero power is beeing used on this character
            api.useHeroPower({
                playerId: this.state.game.playerInTurn,
                gameId: this.state.game.id,
                targetId: character.id
            }, (err, game) => {
                this.resetGameState({ game: game });
            });
        } else if (selectedCharacter && selectedCharacter.id === character.id) {
            // Second click on same character
            this.resetState();
        } else if(character.canAttack){
            // First click on character
            this.resetState({
                selectedCharacter: character
            });
        }

    },
    onHeroPowerClick: function (heropower) {
        if (stateUtils.isInBlockingState(this.state.game)) {
            return;
        }

        if (!heropower.canUse) {
            return;
        }

        if (heropower.isTargeting) {
            if (this.state.selectedHeroPower) {
                // The hero power has been canceled.
                this.resetState();
            } else {
                this.resetState({
                    selectedHeroPower: heropower
                });
            }
        } else {
            api.useHeroPower({
                gameId: this.state.game.id,
                playerId: this.state.game.playerInTurn
            }, (err, game) => {
                this.resetGameState({ game: game });
            });
        }
    },
    resetState: function (state) {
        var newState;
        if (historyBackSteps === 0) {
            newState = history[history.length - 1 - historyBackSteps];
            newState.selectedCharacter =  null;
            newState.selectedCard = null;
            newState.selectedPosition = null;
            newState.selectedHeroPower = null;

            for (var prop in state) {
                if (state.hasOwnProperty(prop)) {
                    newState[prop] = state[prop];
                }
            }
        } else {
            newState = history[history.length - 1 - historyBackSteps];
            newState.selectedCharacter =  null;
            newState.selectedCard = null;
            newState.selectedPosition = null;
        }

        this.setState(newState);
    },
    resetGameState: function (game) {
        var that = this;

        var intermediateStates = game.game.intermediateStates;

        var setStateWithDelay = function (index) {

            var s = {};
            var intermediateStateInfo;
            if (intermediateStates[index]) {
                var intermediateState = intermediateStates[index];
                that.props.audioHandler.playMinionTrigger(intermediateStates[index].entityName);
                s = intermediateState.state;

                    intermediateStateInfo = {
                        entityId: intermediateState.entityId,
                        entityName: intermediateState.entityName,
                        eventName: intermediateState.eventName
                    };

            } else {
                s = game;
            }

            var newState = {
                selectedCharacter: null,
                selectedCard: null,
                selectedPosition: null,
                selectedHeroPower: null
            };

            if (intermediateStateInfo) {
                newState.intermediateStateInfo = {
                    entityId: intermediateState.entityId,
                    entityName: intermediateState.entityName,
                    eventName: intermediateState.eventName
                };
            } else {
                newState.intermediateStateInfo = {};
            }

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
                    }, 500);
                }
            });
        };

        setStateWithDelay(0);
    }
});
