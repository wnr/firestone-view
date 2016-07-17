import React from "react";
import ReactDOM from "react-dom";

import Card from "../card/card";

export default function (props) {
    const card = props.card;
    const glow = card.playable;
    const glowSpecial = card.combo;
    const focused = props.selectedCard && props.selectedCard.id === card.id;

    return <Card card={card} glow={glow} glowSpecial={glowSpecial} focused={focused} />;
}
