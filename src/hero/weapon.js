import React from "react";
import classNames from "classnames";

export default function Weapon(props) {
    const weapon = props.weapon;
    if (!weapon) {
        return <div></div>;
    }

    const weaponClassName = classNames({
        "hero-weapon": true
    });

    return (
		<div className={weaponClassName}>
            <img className="hero-weapon__portrait" draggable="false" src={"asset/image/weapon/" + weapon.name} />
            <img className="hero-weapon__frame" draggable="false" src="asset/image/inplay_weapon.png" />
            <div className="hero-weapon__overlay">
                <Attack weapon={weapon} />
                <Durability weapon={weapon} />
            </div>

		</div>
	);
}

function Attack(props) {
    const weapon = props.weapon;
    const attackClassName = classNames({
        "hero-weapon__overlay__attack": true,
        "stats-text":           weapon.attack === weapon.originalAttack,
        "stats-text--enhanced": weapon.attack > weapon.originalAttack,
        "stats-text--worsened": weapon.attack < weapon.originalAttack
    });
    return (
        <svg className={attackClassName} viewBox="0 0 100 100">
            <text x="50" y="50">{weapon.attack}</text>
        </svg>
    );
}

function Durability(props) {
    const weapon = props.weapon;
    const durabilityClassName = classNames({
        "hero-weapon__overlay__durability": true,
        "stats-text":           (weapon.durability === weapon.maxDurability) && (weapon.durability === weapon.originalDurability),
        "stats-text--enhanced": (weapon.durability === weapon.maxDurability) && (weapon.durability > weapon.originalDurability),
        "stats-text--worsened": weapon.durability < weapon.maxDurability
    });
    return (
        <svg className={durabilityClassName} viewBox="0 0 100 100">
            <text x="50" y="50">{weapon.durability}</text>
        </svg>
    );
}
