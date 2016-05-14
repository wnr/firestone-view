import React from "react";
import classNames from "classnames";

export default function HeroPower(props) {
    const heroPower = props.heroPower;
    const selectedHeroPower = props.selectedHeroPower;

    const heroPowerClassName = classNames({
        "hero-power": true,
        "can-use": heroPower.canUse,
        "selected": heroPower === selectedHeroPower
    });

    return (
		<div className={heroPowerClassName} onClick={() => props.onClick(heroPower)}>
            <img className="hero-power__portrait" draggable="false" src={"asset/image/heropower/" + heroPower.name + ".png"} />
            <img className="hero-power__frame" draggable="false" src="asset/image/heropower-frame.png" />
            <div className="her-power__overlay">
                <Mana heroPower={heroPower} />
			</div>
		</div>
	);
}

function Mana(props) {
    const heroPower = props.heroPower;
    const manaClassName = classNames({
        "hero-power__overlay__mana": true,
        "stats-text":           heroPower.manaCost === heroPower.originalManaCost,
        "stats-text--enhanced": heroPower.manaCost < heroPower.originalManaCost,
        "stats-text--worsened": heroPower.manaCost > heroPower.originalManaCost
    });

    return (
        <svg className={manaClassName} viewBox="0 0 100 100">
            <text x="50" y="50">{heroPower.manaCost}</text>
        </svg>
    );
}
