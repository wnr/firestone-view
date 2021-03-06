import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import { updateElement } from "../dom-utils";

export default React.createClass({
    render: function () {
        const card = this.props.card;

        const classType = card.class || "neutral";

        const cardClassName = classNames({
            "card-weapon": true,
            "fade-in": true,
            "glow": this.props.glow,
            "glow-special": this.props.glowSpecial,
            "focused": this.props.focused
        });

        return (
            <div className={cardClassName}>
                <img className="card-weapon__portrait" src={"/asset/image/card/weapon/" + card.name} />
                <img className="card-weapon__frame" src={"asset/image/card/weapon frame " + classType} />
                <div className="card-weapon__overlay">
                    <Mana card={card} />
                    <Name name={card.name} />
                    <Gem rarity={card.rarity} />
                    <Swirl />
                    <Description description={card.description} />
                    <Attack card={card} />
                    <Durability card={card} />
                </div>
            </div>
        );
    }
});

function Mana(props) {
    const card = props.card;
    const manaClassName = classNames({
        "card-weapon__overlay__mana": true,
        "stats-text":           card.manaCost === card.originalManaCost,
        "stats-text--enhanced": card.manaCost < card.originalManaCost,
        "stats-text--worsened": card.manaCost > card.originalManaCost
    });

    return (
        <svg className={manaClassName} viewBox="0 0 100 100">
            <text x="50" y="50">{card.manaCost}</text>
        </svg>
    );
}

function Gem(props) {
    if (!props.rarity) {
        return (<div></div>);
    }

    return (
        <div className="card-weapon__overlay__rarity">
            <img className="card-weapon__overlay__rarity__bracket" src="/asset/image/card/weapon gem brackets" />
            <img className="card-weapon__overlay__rarity__gem" src={"/asset/image/card/gem " + props.rarity} />
        </div>
    );
}

function Swirl(props) {
    return <img className="card-weapon__overlay__swirl" src="/asset/image/card/weapon swirl basic" />;
}

var Name = React.createClass({
    componentDidMount: function () {
        this.adjustFontSize();
    },
    render: function () {
        const style = {
            position: "absolute",
            top: "3px",
            left: "-14px"
        };

        const textPath = "<textPath xlink:href=\"#weaponCardNamePath\" startOffset=\"50%\">" + this.props.name + "</textPath>";

        return (
            <svg className="card-weapon__overlay__name" viewBox="0 0 400 543">
                <defs>
                    <path id="weaponCardNamePath" d="m 69.428571,291.50506 276.285719,0"></path>
                </defs>
                <text ref="name" fontFamily="Belwe" fontSize="30" fill="white" stroke="black" strokeWidth="5" textAnchor="middle" dangerouslySetInnerHTML={{__html: textPath }}></text>
                <text ref="nameShadow" fontFamily="Belwe" fontSize="30" fill="white" textAnchor="middle" dangerouslySetInnerHTML={{__html: textPath }}></text>
            </svg>
        );
    },
    adjustFontSize: function (cardtype, title) {
        const nameNode = this.refs.name;
        const nameShadowNode = this.refs.nameShadow;

        var fsize = nameNode.getAttribute("font-size");
        const bbox = nameNode.getBBox();
        const width = bbox.width;
        const maxTitleSize = 295;

        if (width < maxTitleSize - 50) {
            nameNode.setAttribute("font-size", "30");
            nameShadowNode.setAttribute("font-size", "30");
        }

        while (width > maxTitleSize) {
            fsize = fsize - 1;
            nameNode.setAttribute("font-size", fsize);
            nameShadowNode.setAttribute("font-size", fsize);
            const bbox = nameNode.getBBox();
            const width = bbox.width;
        }
    }
});

function Description(props) {
    return (
        <svg className="card-weapon__overlay__description" viewBox="0 0 200 100">
            <foreignObject width="100%" height="100%">
                <div className="card-weapon__overlay__description__text"><div>{props.description}</div></div>
            </foreignObject>
        </svg>
    );
}

function Attack(props) {
    const card = props.card;
    const attackClassName = classNames({
        "card-weapon__overlay__attack": true,
        "stats-text":           card.attack === card.originalAttack,
        "stats-text--enhanced": card.attack > card.originalAttack,
        "stats-text--worsened": card.attack < card.originalAttack
    });

    return (
        <svg className={attackClassName} viewBox="0 0 100 50">
            <text x="50" y="45">{card.attack}</text>
        </svg>
    );
}

function Durability(props) {
    const card = props.card;
    const className = classNames({
        "card-weapon__overlay__durability": true,
        "stats-text":           card.durability === card.originalDurability,
        "stats-text--enhanced": card.durability > card.originalDurability,
        "stats-text--worsened": card.durability < card.originaDurability
    });

    return (
        <svg className={className} viewBox="0 0 100 50">
            <text x="50" y="45">{card.durability}</text>
        </svg>
    );
}
