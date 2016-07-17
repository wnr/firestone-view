import React from "react";
import classNames from "classnames";

export default function Weapon(props) {
    const weapon = props.weapon;
    if (!weapon) {
        return <div></div>;
    }
    const selectedWeapon = props.selectedWeapon;

    const weaponClassName = classNames({
        "weapon": true,
        "can-use": weapon.canUse,
        "selected": weapon === selectedWeapon
    });

    return (
		<div className={weaponClassName}>
            <img className="weapon__portrait" draggable="false" src={"asset/image/weapon/" + weapon.name} />
            <img className="weapon__frame" draggable="false" src="asset/image/inplay_weapon.png" />
            <div className="weapon__overlay">
                <Mana weapon={weapon} />
            </div>

		</div>
	);
}

function Mana(props) {
    const weapon = props.weapon;
    const manaClassName = classNames({
    });

    return (
        <svg className={manaClassName} viewBox="0 0 100 100">
            <text x="50" y="50">{weapon.manaCost}</text>
        </svg>
    );
}