import React from "react";
import classNames from "classnames";

export default function Face(props) {
    const hero = props.hero;
    const secrets = props.secrets;

    // TODO: The targeting logic is shared by characters (minion and hero).
    const selectedCard = props.selectedCard;
    const selectedHeroPower = props.selectedHeroPower;
    const selectedCharacter = props.selectedCharacter;
    const selectedPosition = props.selectedPosition;

    function isPlayerTargeting() {
        // Targeting minion cards need to select a position for the minion, before a target may be chosen.
        return selectedCard && selectedCard.isTargeting && (selectedCard.type === "spell" || Number.isInteger(selectedPosition));
    }

    function isValidTargetByHeroPowerAttack() {
        return selectedHeroPower && selectedHeroPower.validTargetIds.indexOf(hero.id) !== -1;
    }

    function isValidTargetByCharacterAttack() {
        return selectedCharacter && selectedCharacter.validAttackIds.indexOf(hero.id) !== -1;
    }

    function isValidTargetByCard() {
        return isPlayerTargeting() && selectedCard.validTargetIds.indexOf(hero.id) !== -1;
    }

    function isValidTarget() {
        return isValidTargetByHeroPowerAttack() || isValidTargetByCharacterAttack() || isValidTargetByCard();
    }

    const faceClassName = classNames({
        "hero-face": true,
        "fade-in": true,
        "can-attack": hero.canAttack,
        "valid-target": isPlayerTargeting() && isValidTarget(),
        "non-valid-target": (isPlayerTargeting() && !isValidTarget()) || (selectedCharacter && selectedCharacter.id !== hero.id && !isValidTargetByCharacterAttack()),
        "focused": selectedCharacter && selectedCharacter.id === hero.id
    });

    return (
		<div className={faceClassName} onClick={() => props.onClick(hero)}>
            <img className="hero-face__portrait" src={"/asset/image/hero/" + hero.name + ".png"} />
            <img className="hero-face__frame" src="/asset/image/hero frame.png" />
            <div className="hero-face__overlay">
                <Secrets secrets={secrets} />
                <Frozen hero={hero} />
                <Armor hero={hero} />
                <Health hero={hero} />
            </div>
        </div>
	);
}

function Frozen(props) {
    const hero = props.hero;

    if (hero.states.some(function (state) { return state === "FROZEN"; })) {
        return <img className="hero-face__overlay__frozen" src="/asset/image/frozen.png" />;
    }
    return <div></div>;
}

function Secrets(props) {
    const secrets = props.secrets;

    if (!secrets.length) {
        return <div></div>;
    }

    // TODO: Fix so that multiple secrets may be displayed.

    return (
        <div className="hero-face__overlay__secret">
            <img src="/asset/image/secret_sheathed.png" />
            <svg className="stats-text" viewBox="0 0 100 100">
                <text x="50" y="50">?</text>
            </svg>
        </div>
    );
}

function Armor(props) {
    const hero = props.hero;

    if (!hero.armor) {
        return <div></div>;
    }

    return (
        <div className="hero-face__overlay__armor">
            <img src="/asset/image/armor.png" />
            <svg className="stats-text" viewBox="0 0 100 100">
                <text x="50" y="50">{hero.armor}</text>
            </svg>
        </div>
    );
}

function Health(props) {
    const hero = props.hero;
    const healthTextClassName = classNames({
        "stats-text":           hero.health === hero.maxHealth,
        "stats-text--enhanced": hero.health > hero.maxHealth,
        "stats-text--worsened": hero.health < hero.maxHealth
    });

    return (
        <div className="hero-face__overlay__health">
            <img src="/asset/image/health.png" />
            <svg className={healthTextClassName} viewBox="0 0 100 100">
                <text x="50" y="50">{hero.health}</text>
            </svg>
        </div>
    );
}
