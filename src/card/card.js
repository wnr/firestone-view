import React from "react";
import ReactDOM from "react-dom";

import MinionCard from "./minion";
import SpellCard from "./spell";
import WeaponCard from "./weapon";

export default function (props) {
    const type = props.card.type;

    if (type === "minion") {
        return <MinionCard {...props} />;
    } else if (type === "weapon") {
        return <WeaponCard {...props} />;
    } else if (type === "spell") {
        return <SpellCard {...props} />;
    } else {
        throw new Error("Unknown card type: " + type);
    }
}
