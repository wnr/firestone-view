import React from "react";
import ReactDOM from "react-dom";

import Face from "./face";
import HeroPower from "./hero-power";
import Mana from "./mana";
import Weapon from "./weapon";

export default function Hero(props) {
    const hero = props.hero;
    const weapon = hero.weapon;
    const secrets = props.secrets;
    const selectedCard = props.selectedCard;
    const selectedHeroPower = props.selectedHeroPower;
    const selectedCharacter = props.selectedCharacter;
    const selectedPosition = props.selectedPosition;

    return (
        <div className="hero">
            <Weapon weapon={weapon} />
            <Face
                hero={hero}
                secrets={secrets}
                selectedCard={selectedCard}
                selectedHeroPower={selectedHeroPower}
                selectedCharacter={selectedCharacter}
                selectedPosition={selectedPosition}
                onClick={props.onHeroClick}
            />
            <HeroPower heroPower={hero.heropower} selectedHeroPower={selectedHeroPower} onClick={props.onHeroPowerClick} />
            <Mana hero={hero} />
        </div>
    );
}
