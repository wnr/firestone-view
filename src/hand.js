var React = require("react");
var ReactDOM = require("react-dom");

import Card from "./card";

export default function Hand(props) {
    var cards = props.cards.map(function (card) {
        var className = "card";

        if (card.playable) {
            className += " playable";
        }

        return (
            <li key={card.id} className={className}>
                <Card imageProvider={props.imageProvider} card={card} />
            </li>
        );
    });

    return (
        <div className="hand">
            <ul>
                {cards}
            </ul>
        </div>
    );
}
