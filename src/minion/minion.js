import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

export default function Minion(props) {
    const minion = props.minion;
    const selectedCard = props.selectedCard;
    const selectedHeroPower = props.selectedHeroPower;
    const selectedMinion = props.selectedMinion;
    const selectedPosition = props.selectedPosition;

    function isPlayerTargeting() {
        // Targeting minion cards need to select a position for the minion, before a target may be chosen.
        return selectedCard && selectedCard.isTargeting && (selectedCard.type === "SPELL" || Number.isInteger(selectedPosition));
    }

    function isValidTargetByHeroAttack() {
        return selectedHeroPower && selectedHeroPower.validTargetIds.indexOf(minion.id) !== -1;
    }

    function isValidTargetByMinionAttack() {
        return selectedMinion && selectedMinion.validAttackIds.indexOf(minion.id) !== -1;
    }

    function isValidTargetByCard() {
        return isPlayerTargeting() && selectedCard.validTargetIds.indexOf(minion.id) !== -1;
    }

    function isValidTarget() {
        return isValidTargetByHeroAttack() || isValidTargetByMinionAttack() || isValidTargetByCard();
    }

    const minionClassName = classNames({
        "minion": true,
        "fade-in": true,
        "can-attack": minion.canAttack,
        "valid-target": isPlayerTargeting() && isValidTarget(),
        "non-valid-target": isPlayerTargeting() && !isValidTarget(),
        "focused": selectedMinion && selectedMinion.id === minion.id
    });

    return (
        <div className={minionClassName}>
            <img className="minion__portrait" src={"/asset/image/card/minion/" + minion.name} />
            <img className="minion__frame" src="/asset/image/minion frame.png" />
            <div className="minion__overlay">
                <Attack minion={minion} />
                <Health minion={minion} />
            </div>
        </div>
    );
}

function Attack(props) {
    const minion = props.minion;
    const attackClassName = classNames({
        "minion__overlay__attack": true,
        "stats-text":           minion.attack === minion.originalAttack,
        "stats-text--enhanced": minion.attack > minion.originalAttack,
        "stats-text--worsened": minion.attack < minion.originalAttack
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
        "stats-text":           minion.health === minion.originalHealth,
        "stats-text--enhanced": minion.health > minion.originalHealth,
        "stats-text--worsened": minion.health < minion.originalHealth
    });

    return (
        <svg className={healthClassName} viewBox="0 0 100 100">
            <text x="50" y="50">{minion.health}</text>
        </svg>
    );
}