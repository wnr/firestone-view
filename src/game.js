import React from "react";
import ReactDOM from "react-dom";

import Hand from "./hand";
import Hero from "./hero";
import Battlefield from "./battlefield";
import * as api from "./game-api";
import { getPlayerById } from "./game-state-utils";

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
        var thisComponent = this;

        api.createGame((err, game) => {
            if (err) {
                this.setState({
                    error: true
                });
                return;
            }

            thisComponent.setState({
                game: game
            });
        });
    },
    render: function () {
        var imageProvider = this.props.imageProvider;

        var game = this.state.game;

        if (!game) {
            if (this.state.error) {
                return <strong>Failed to connect to game server</strong>;
            }

            return <div></div>;
        }

        var friendlyPlayer = game.players[0];
        var opponentPlayer = game.players[1];

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
                    <div className="end-turn-container">
                        <button className="end-turn" onClick={this.endTurn}>End turn</button>
                    </div>
                </div>
            </div>
        );
    },
    endTurn: function () {
        this.props.audioHandler.play("ALERT_YourTurn_0v2.ogg");

        var game = this.state.game;
        var data = {
            gameId: game.id,
            playerId: game.playerInTurn
        };

        api.endTurn(data, (err, game) => {
            this.resetState({ game: game });
        });
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
        var card = this.state.selectedCard;
        if (card && !card.isTargeting && card.type === "SPELL") {
            api.playCard({
                gameId: this.state.game.id,
                cardId: card.id
            }, (err, game) => {
                this.resetState({ game: game });
            });
        }
    },
    onPositionClick: function (position) {
        if (this.state.selectedCard.isTargeting && this.state.selectedCard.validTargetIds.length) {
            this.setState({
                selectedPosition: position
            });
        } else {
            api.playMinionCard({
                gameId: this.state.game.id,
                cardId: this.state.selectedCard.id,
                position: position
            }, (err, game) => {
                this.resetState({ game: game });
            });
        }
    },
    onHeroClick: function (hero) {
        var selectedMinion = this.state.selectedMinion;
        var selectedCard = this.state.selectedCard;
        if (selectedMinion && (selectedMinion.validAttackIds.indexOf(hero.id) >= 0)) {
            api.attack({
                gameId: this.state.game.id,
                attackerId: selectedMinion.id,
                targetId: hero.id
            }, (err, game) => {
                this.resetState({ game: game });
            });
        } else if (selectedCard && selectedCard.isTargeting && selectedCard.validTargetIds.indexOf(hero.id) !== -1) {
            api.playCard({
                gameId: this.state.game.id,
                cardId: selectedCard.id,
                targetId: hero.id
            }, (err, game) => {
                this.resetState({ game: game });
            });
        }
    },
    onMinionClick: function (minion) {
        if (this.state.selectedMinion) {
            if (this.state.selectedMinion.id === minion.id) {
                this.resetState();
            } else if ((this.state.selectedMinion.validAttackIds.indexOf(minion.id) >= 0)) {
                // Minion attacks a minion
                api.attack({
                    gameId: this.state.game.id,
                    attackerId: this.state.selectedMinion.id,
                    targetId: minion.id
                }, (err, game) => {
                    this.resetState({ game: game });
                });
            }
        } else if (this.state.selectedCard) {
            if (this.state.selectedPosition !== null) {
                // Targeting card is being played on the given minion as target.
                api.playMinionCard({
                    gameId: this.state.game.id,
                    cardId: this.state.selectedCard.id,
                    position: this.state.selectedPosition,
                    targetId: minion.id
                }, (err, game) => {
                    this.resetState({ game: game });
                });
            } else if (this.state.selectedCard.type === "SPELL" && this.state.selectedCard.isTargeting) {
                api.playCard({
                    gameId: this.state.game.id,
                    cardId: this.state.selectedCard.id,
                    targetId: minion.id
                }, (err, game) => {
                    this.resetState({ game: game });
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
        var newState = {
            selectedMinion: null,
            selectedCard: null,
            selectedPosition: null
        };

        for (var prop in state) {
            if (state.hasOwnProperty(prop)) {
                newState[prop] = state[prop];
            }
        }

        this.setState(newState);
    }
});
