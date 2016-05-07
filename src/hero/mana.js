import React from "react";

export default function Mana(props) {
    const hero = props.hero;

    return (
        <div className="hero-mana">
            <img src="/asset/image/mana.png" />
            <svg viewBox="0 0 200 100">
                <text x="100" y="50">{hero.mana}/{hero.maxMana}</text>
            </svg>
        </div>
    );
}
