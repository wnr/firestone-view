import React from "react";
import ReactDOM from "react-dom";

import Card from "./card/card";

export default function Hand(props) {
    const cards = props.cards.map(function (card) {
        return (
            <li key={card.id} onClick={props.onCardClick.bind(null, card)}>
                <Card selectedCard={props.selectedCard} imageProvider={props.imageProvider} card={card} />
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
