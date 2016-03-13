var React = require("react");
var ReactDOM = require("react-dom");

import Hand from "./hand";

var cards = [
    {
        id: 0,
        name: "Imp",
        description: "Ugly little thing",
        manaCost: 1,
        attack: 1,
        health: 1
    },
    {
        id: 1,
        name: "Imp",
        description: "Ugly little thing",
        manaCost: 1,
        attack: 1,
        health: 1
    },
    {
        id: 2,
        name: "Imp",
        description: "Ugly little thing",
        manaCost: 1,
        attack: 1,
        health: 1
    }
];

export default React.createClass({
    getInitialState: function () {
        return {
            game: null
        };
    },
    render: function () {
        return (
            <div className="container">
                <div className="game">
                    <div className="side opponent">
                        <div className="hand">
                            <Hand imageProvider={this.props.imageProvider} cards={cards} />
                        </div>
                        <div className="hero-container"></div>
                    </div>
                    <div className="battlefield">
                        <div className="side opponent">
                        </div>
                        <div className="side friendly">
                        </div>
                    </div>
                    <div className="side friendly">
                        <div className="hero-container"></div>
                        <div className="hand">
                            <Hand imageProvider={this.props.imageProvider} cards={cards} />
                        </div>
                    </div>
                    <div className="end-turn-container">
                        <button className="end-turn">End turn</button>
                    </div>
                </div>
            </div>
        );
    }
});
