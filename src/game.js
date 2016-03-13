var React = require("react");
var ReactDOM = require("react-dom");

import Hand from "./hand";
import Hero from "./hero";

var cards = [
    {
        id: 0,
        name: "Imp",
        description: "Ugly little thing",
        manaCost: 1,
        attack: 1,
        health: 1,
        playable: true
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

var hero = {
    health: 30,
    attack: 0,
    mana: 10,
    maxMana: 10
};

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
                        <Hand imageProvider={this.props.imageProvider} cards={cards} />
                        <Hero imageProvider={this.props.imageProvider} hero={hero} />
                    </div>
                    <div className="battlefield">
                        <div className="side opponent">
                        </div>
                        <div className="side friendly">
                        </div>
                    </div>
                    <div className="side friendly">
                        <Hero imageProvider={this.props.imageProvider} hero={hero} />
                        <Hand imageProvider={this.props.imageProvider} cards={cards} />
                    </div>
                    <div className="end-turn-container">
                        <button className="end-turn">End turn</button>
                    </div>
                </div>
            </div>
        );
    }
});
