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
                <div className="game">
                    <div className="side opponent">
                        <Hand imageProvider={imageProvider} cards={opponentPlayer.hand} onCardClick={this.onCardClick} selectedCard={this.state.selectedCard} />
                        <Hero imageProvider={imageProvider} hero={opponentPlayer.hero} />
                    </div>
                    <Battlefield
                        showPositions={this.state.selectedCard}
                        bottomPlayerInTurn={this.state.bottomPlayerInTurn}
                        imageProvider={imageProvider}
                        topMinions={opponentPlayer.activeMinions}
                        bottomMinions={friendlyPlayer.activeMinions}
                        onPositionClick={this.onPositionClick}
                        onMinionClick={this.onMinionClick}
                        selectedMinion={this.state.selectedMinion}
                    />
                    <div className="side friendly">
                        <Hero imageProvider={imageProvider} hero={friendlyPlayer.hero} />
                        <Hand imageProvider={imageProvider} cards={friendlyPlayer.hand} onCardClick={this.onCardClick} selectedCard={this.state.selectedCard} />
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
            this.setState({
                game: game
            });
        });
    },
    onCardClick: function (card) {
        if (!card.playable) {
            console.log("Card not playable");
            return;
        }

        if (this.state.selectedCard && this.state.selectedCard.id === card.id) {
            this.setState({
                selectedCard: null,
                selectedPosition: null
            });
        } else {
            this.setState({
                selectedCard: card,
                selectedPosition: null
            });
        }
    },
    onPositionClick: function (position) {
        var data = {
            gameId: this.state.game.id,
            cardId: this.state.selectedCard.id,
            position: position
        };

        // if (targetId) {
        //     data.targetId = targetId;
        // }

        api.playMinionCard(data, (err, game) => {
            this.setState({
                game: game,
                selectedCard: null,
                selectedPosition: null
            })
        });
    },
    onMinionClick: function (minion) {
        if (this.state.selectedMinion) {
            api.attack({
                gameId: this.state.game.id,
                attackerId: this.state.selectedMinion.id,
                targetId: minion.id
            }, (err, game) => {
                this.setState({
                    game: game,
                    selectedMinion: null
                });
            });
        } else {
            this.setState({
                selectedMinion: minion,
                selectedCard: null,
                selectedPosition: null
            });
        }
    }
});
