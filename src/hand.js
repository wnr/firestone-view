import React from "react";
import ReactDOM from "react-dom";

import Card from "./card/card";

export default function Hand(props) {
    var cards = props.cards.map(function (card) {
        var className = "card";

        if (card.playable) {
            className += " playable";
        }

        if (props.selectedCard && props.selectedCard.id === card.id) {
            className += " focused"
        }

        return (
            <li key={card.id} className={className} onClick={props.onCardClick.bind(null, card)}>
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
