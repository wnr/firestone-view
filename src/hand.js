var React = require("react");
var ReactDOM = require("react-dom");

import Card from "./card";

export default function Hand(props) {
    var cards = props.cards.map(function (card) {
        return (
            <li key={card.id} className="card">
                <Card imageProvider={props.imageProvider} card={card} />
            </li>
        );
    });

    return (
        <ul>
            {cards}
        </ul>
    );
}
