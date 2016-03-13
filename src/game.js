var React = require("react");
var ReactDOM = require("react-dom");

import Hand from "./hand";
import Hero from "./hero";
import Battlefield from "./battlefield";

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

var minions1 = [
    {
        id: 0,
        name: "Imp",
        attack: 1,
        health: 1,
        states: []
    },
    {
        id: 1,
        name: "Imp",
        attack: 1,
        health: 1,
        states: []
    },
    {
        id: 2,
        name: "Imp",
        attack: 1,
        health: 1,
        states: []
    },
];

var minions2 = [
    {
        id: 0,
        name: "Imp",
        attack: 1,
        health: 1,
        states: []
    },
    {
        id: 1,
        name: "Imp",
        attack: 1,
        health: 1,
        states: []
    },
    {
        id: 2,
        name: "Imp",
        attack: 1,
        health: 1,
        states: []
    },
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
        var imageProvider = this.props.imageProvider;

        return (
            <div className="container">
                <div className="game">
                    <div className="side opponent">
                        <Hand imageProvider={imageProvider} cards={cards} />
                        <Hero imageProvider={imageProvider} hero={hero} />
                    </div>
                    <Battlefield imageProvider={imageProvider} minions1={minions1} minions2={minions2} />
                    <div className="side friendly">
                        <Hero imageProvider={imageProvider} hero={hero} />
                        <Hand imageProvider={imageProvider} cards={cards} />
                    </div>
                    <div className="end-turn-container">
                        <button className="end-turn">End turn</button>
                    </div>
                </div>
            </div>
        );
    }
});
