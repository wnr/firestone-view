import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

export default function Minion(props) {
    const minion = props.minion;
    const selectedCard = props.selectedCard;
    const selectedHeroPower = props.selectedHeroPower;
    const selectedCharacter = props.selectedCharacter;
    const selectedPosition = props.selectedPosition;

    function isPlayerTargeting() {
        // Targeting minion cards need to select a position for the minion, before a target may be chosen.
        return selectedCard && selectedCard.isTargeting && (selectedCard.type === "spell" || Number.isInteger(selectedPosition));
    }

    function isValidTargetByHeroPowerAttack() {
        return selectedHeroPower && selectedHeroPower.validTargetIds.indexOf(minion.id) !== -1;
    }

    function isValidTargetByCharacterAttack() {
        return selectedCharacter && selectedCharacter.validAttackIds.indexOf(minion.id) !== -1;
    }

    function isValidTargetByCard() {
        return isPlayerTargeting() && selectedCard.validTargetIds.indexOf(minion.id) !== -1;
    }

    function isValidTarget() {
        return isValidTargetByHeroPowerAttack() || isValidTargetByCharacterAttack() || isValidTargetByCard();
    }

    const minionClassName = classNames({
        "minion": true,
        "fade-in": true,
        "can-attack": minion.canAttack,
        "valid-target": isPlayerTargeting() && isValidTarget(),
        "non-valid-target": (isPlayerTargeting() && !isValidTarget()) || (selectedCharacter && selectedCharacter.id !== minion.id && !isValidTargetByCharacterAttack()),
        "focused": selectedCharacter && selectedCharacter.id === minion.id
    });

    return (
        <div className={minionClassName}>
            <Taunt minion={minion} />
            <img className="minion__portrait" src={"/asset/image/card/minion/" + minion.name} />
            <img className="minion__frame" src="/asset/image/minion frame.png" />
            <div className="minion__overlay">
                <Deathrattle minion={minion} />
                <Inspire minion={minion} />
                <Poison minion={minion} />
                <Dragon minion={minion} />
                <Frozen minion={minion} />
                <Stealth minion={minion} />
                <Enrage minion={minion} />
                <Attack minion={minion} />
                <Health minion={minion} />
                <DivineShield minion={minion} />
                <Sleepy minion={minion} />
            </div>
        </div>
    );
}

function Deathrattle(props) {
    const minion = props.minion;
    if (minion.states.some(function (state) { return state === "DEATHRATTLE"; })) {
        return <img className="minion__overlay__deathrattle" src="/asset/image/icon_deathrattle.png" />;
    }
    return <div></div>;
}

function DivineShield(props) {
    const minion = props.minion;
    if (minion.states.some(function (state) { return state === "DIVINE_SHIELD"; })) {
        return <img className="minion__overlay__divine_shield" src="/asset/image/inplay_minion_divine_shield.png" />;
    }
    return <div></div>;
}

function Dragon(props) {
    const minion = props.minion;
    if (minion.rarity === "legendary") {
        return <img className="minion__overlay__dragon" src="/asset/image/inplay_minion_legendary.png" />;
    }
    return <div></div>;
}

function Enrage(props) {
    const minion = props.minion;
    if (minion.states.some(function (state) { return state === "ENRAGE"; })) {
        return <img className="minion__overlay__enrage" src="/asset/image/inplay_minion_enrage.png" />;
    }
    return <div></div>;
}

function Stealth(props) {
    const minion = props.minion;
    if (minion.states.some(function (state) { return state === "STEALTH"; })) {
        return <img className="minion__overlay__stealth" src="/asset/image/inplay_minion_stealth.png" />;
    }
    return <div></div>;
}

function Frozen(props) {
    const minion = props.minion;
    if (minion.states.some(function (state) { return state === "FROZEN"; })) {
        return <img className="minion__overlay__frozen" src="/asset/image/inplay_minion_frozen.png" />;
    }
    return <div></div>;
}

function Inspire(props) {
    const minion = props.minion;
    if (minion.states.some(function (state) { return state === "INSPIRE"; })) {
        return <img className="minion__overlay__inspire" src="/asset/image/icon_inspire.png" />;
    }
    return <div></div>;
}

function Poison(props) {
    const minion = props.minion;
    if (minion.states.some(function (state) { return state === "POISON"; })) {
        return <img className="minion__overlay__poison" src="/asset/image/icon_poisonous.png" />;
    }
    return <div></div>;
}

function Sleepy(props) {
    const minion = props.minion;
    if (minion.sleepy) {
        return <img className="minion__sleepy" src="/asset/image/effect_sleep.png" />;
    }
    return <div></div>;
}

function Taunt(props) {
    const minion = props.minion;
    if (minion.states.some(function (state) { return state === "TAUNT"; })) {
        return <img className="minion__taunt" src="/asset/image/inplay_minion_taunt.png" />;
    }
    return <div></div>;
}

function Attack(props) {
    const minion = props.minion;
    const attackClassName = classNames({
        "minion__overlay__attack": true,
        "stats-text":           minion.attack <= minion.originalAttack,
        "stats-text--enhanced": minion.attack > minion.originalAttack,
//        "stats-text--worsened": minion.attack < minion.originalAttack
    });

    return (
        <svg className={attackClassName} viewBox="0 0 100 100">
            <text x="50" y="50">{minion.attack}</text>
        </svg>
    );
}

function Health(props) {
    const minion = props.minion;
    const healthClassName = classNames({
        "minion__overlay__health": true,
        "stats-text":           minion.health <= minion.originalHealth && minion.health === minion.maxHealth,
        "stats-text--enhanced": minion.health > minion.originalHealth && minion.health === minion.maxHealth,
        "stats-text--worsened": minion.health < minion.maxHealth
    });

    return (
        <svg className={healthClassName} viewBox="0 0 100 100">
            <text x="50" y="50">{minion.health}</text>
        </svg>
    );
}
