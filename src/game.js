var React = require("react");
var ReactDOM = require("react-dom");

import Hand from "./hand";
import Hero from "./hero";
import Battlefield from "./battlefield";
import * as api from "./game-api";
import { getPlayerById } from "./game-state-utils";

export default React.createClass({
    getInitialState: function () {
        return {
            game: null,
            friendlyPlayerId: null,
            opponentPlayerId: null
        };
    },
    componentDidMount: function () {
        var thisComponent = this;

        api.createGame(function (game) {
            thisComponent.setState({
                game: game,
                friendlyPlayerId: game.players[0].id,
                opponentPlayerId: game.players[1].id
            });
        });
    },
    render: function () {
        var imageProvider = this.props.imageProvider;

        var game = this.state.game;

        if (!game) {
            return <div></div>;
        }

        var friendlyPlayer = getPlayerById(game, this.state.friendlyPlayerId);
        var opponentPlayer = getPlayerById(game, this.state.opponentPlayerId);

        return (
            <div className="container">
                <div className="game">
                    <div className="side opponent">
                        <Hand imageProvider={imageProvider} cards={opponentPlayer.hand} />
                        <Hero imageProvider={imageProvider} hero={opponentPlayer.hero} />
                    </div>
                    <Battlefield imageProvider={imageProvider} topMinions={opponentPlayer.activeMinions} bottomMinions={friendlyPlayer.activeMinions} />
                    <div className="side friendly">
                        <Hero imageProvider={imageProvider} hero={friendlyPlayer.hero} />
                        <Hand imageProvider={imageProvider} cards={friendlyPlayer.hand} />
                    </div>
                    <div className="end-turn-container">
                        <button className="end-turn">End turn</button>
                    </div>
                </div>
            </div>
        );
    }
});
