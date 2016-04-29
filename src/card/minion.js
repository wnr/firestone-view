import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import { updateElement } from "../dom-utils";

export default React.createClass({
    componentDidMount: function () {
        // this.draw(this.props.card);
    },
    render: function () {
        const card = this.props.card;

        const classType = card.class || "neutral";
        const focused = this.props.selectedCard && this.props.selectedCard.id === card.id;

        const cardClassName = classNames({
            "card-minion": true,
            // "fade-in": true,
            "playable": card.playable,
            "combo": card.combo,
            "focused": focused
        });

        return (
            <div className={cardClassName}>
                {/*<Outline card={card} selectedCard={this.props.selectedCard} />*/}
                <img className="card-minion__portrait" src={"/asset/image/card/minion/" + card.name} />
                <img className="card-minion__frame" src={"/asset/image/card/minion frame " + classType} />
                <div className="card-minion__overlay">
                    <Mana card={card} />
                    <Dragon rarity={card.rarity} />
                    <Name name={card.name} />
                    <Gem rarity={card.rarity} />
                    <Swirl />
                    <Description description={card.description} />
                    <Attack card={card} />
                    <Health card={card} />
                    <Race card={card} />
                </div>
            </div>
        );
    }
});

function Outline(props) {
    var blur = 0;
    var spread = 0;
    var color = "rgb(0,0,0)";

    if (props.card.playable) {
        if (props.selectedCard && props.selectedCard.id === props.card.id) {
            blur = "20px";
            spread = "16px";
            if (props.card.combo) {
                color = "yellow"
            } else {
                color = "rgb(0,255,0)";
            }
        } else {
            blur = "20px";
            spread = "8px";
            if (props.card.combo) {
                color = "yellow"
            } else {
                color = "rgb(0,200,0)";
            }
        }
    }

    const outlineStyle = {
        width: "85%",
        height: "88%",
        position: "absolute",
        left: "9%",
        top: "8%",
        boxShadow: `0 0 ${blur} ${spread} ${color}`,
        backgroundColor: color
    };

    return <div style={outlineStyle}></div>;
}

function Mana(props) {
    const card = props.card;
    const manaClassName = classNames({
        "card-minion__overlay__mana": true,
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

function Attack(props) {
    const card = props.card;
    const attackClassName = classNames({
        "card-minion__overlay__attack": true,
        "stats-text":           card.attack === card.originalAttack,
        "stats-text--enhanced": card.attack > card.originalAttack,
        "stats-text--worsened": card.attack < card.originalAttack
    });

    return (
        <svg className={attackClassName} viewBox="0 0 100 100">
            <text x="50" y="50">{card.attack}</text>
        </svg>
    );
}

function Health(props) {
    const card = props.card;
    const healthClassName = classNames({
        "card-minion__overlay__health": true,
        "stats-text":           card.health === card.originalHealth,
        "stats-text--enhanced": card.health > card.originalHealth,
        "stats-text--worsened": card.health < card.originalHealth
    });

    return (
        <svg className={healthClassName} viewBox="0 0 100 100">
            <text x="50" y="50">{card.health}</text>
        </svg>
    );
}

function Dragon(props) {
    if (props.rarity !== "legendary") {
        return <div></div>;
    }

    return (
        <img className="card-minion__overlay__dragon" src="/asset/image/card/minion frame dragon bracket" />
    );
}

function Gem(props) {
    if (!props.rarity) {
        return (<div></div>);
    }

    return (
        <div className="card-minion__overlay__rarity">
            <img className="card-minion__overlay__rarity__bracket" src="/asset/image/card/minion gem brackets" />
            <img className="card-minion__overlay__rarity__gem" src={"/asset/image/card/gem " + props.rarity} />
        </div>
    );
}

function Swirl(props) {
    return <img className="card-minion__overlay__swirl" src="/asset/image/card/minion swirl blackrock" />;
}

var Name = React.createClass({
    componentDidMount: function () {
        this.adjustFontSize();
    },
    render: function () {
        const textPath = "<textPath xlink:href=\"#minionCardNamePath\" startOffset=\"50%\">" + this.props.name + "</textPath>";

        return (
            <svg className="card-minion__overlay__name" viewBox="0 0 400 543">
                <defs>
                    <path id="minionCardNamePath" d="m 56.336299,307.51481 c 0,0 3.8284,6.45932 52.003431,0.99221 28.84576,-3.27354 57.87325,-12.4128 107.80271,-18.66988 36.69487,-4.59854 72.68333,-5.86349 97.95307,-1.16154 27.31819,5.0831 43.46829,12.47526 43.46829,12.47526"></path>
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
        var bbox = nameNode.getBBox();
        var width = bbox.width;
        const maxTitleSize = 295;

        if (width < maxTitleSize - 50) {
            nameNode.setAttribute("font-size", "30");
            nameShadowNode.setAttribute("font-size", "30");
        }

        while (width > maxTitleSize) {
            fsize = fsize - 1;
            nameNode.setAttribute("font-size", fsize);
            nameShadowNode.setAttribute("font-size", fsize);
            bbox = nameNode.getBBox();
            width = bbox.width;
        }
    }
});

function Description(props) {
    return (
        <svg className="card-minion__overlay__description" viewBox="0 0 200 100">
            <foreignObject width="100%" height="100%">
                <div className="card-minion__overlay__description__text"><div>{props.description}</div></div>
            </foreignObject>
        </svg>
    );
}

function Race(props) {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const race = props.card.race;

    if (!race) {
        return <div></div>;
    }

    return (
        <div className="card-minion__overlay__race">
            <img src="/asset/image/card/minion race" />
            <svg viewBox="0 0 100 100">
                <text x="50" y="50">{capitalizeFirstLetter(race)}</text>
            </svg>
        </div>
    );
}
