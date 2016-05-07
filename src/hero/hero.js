import React from "react";
import ReactDOM from "react-dom";

import Face from "./face";
import HeroPower from "./hero-power";
import Mana from "./mana";

export default function Hero(props) {
    const hero = props.hero;
    const secrets = props.secrets;
    const selectedCard = props.selectedCard;
    const selectedHeroPower = props.selectedHeroPower;
    const selectedMinion = props.selectedMinion;
    const selectedPosition = props.selectedPosition;

    return (
        <div className="hero">
            <Mana hero={hero} />
            <Face
                hero={hero}
                secrets={secrets}
                selectedCard={selectedCard}
                selectedHeroPower={selectedHeroPower}
                selectedMinion={selectedMinion}
                selectedPosition={selectedPosition}
                onClick={props.onHeroClick}
            />
            <HeroPower heroPower={props.hero.heropower} selectedHeroPower={props.selectedHeroPower} onClick={props.onHeroPowerClick} />
        </div>
    );
}
