import React from "react";
import ReactDOM from "react-dom";

import Card from "./card/card";

export default function Hand(props) {
    const numberOfCards = props.cards.length;
    const startValue = - Math.floor(numberOfCards / 2);
    const evenNumberOfCards = numberOfCards % 2 === 0;
    var positionClassName = "position";
    if (evenNumberOfCards) { positionClassName += "-even" }

    const cards = props.cards.map(function (card, index) {
        return (
            <li className={positionClassName + (startValue + index)} key={card.id} onClick={props.onCardClick.bind(null, card)}>
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
