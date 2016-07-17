import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import { updateElement } from "../dom-utils";

export default React.createClass({
    render: function () {
        const card = this.props.card;

        const classType = card.class || "neutral";

        const cardClassName = classNames({
            "card-spell": true,
            "fade-in": true,
            "glow": this.props.glow,
            "glow-special": this.props.glowSpecial,
            "focused": this.props.focused
        });

        return (
            <div className={cardClassName}>
                <img className="card-spell__portrait" src={"/asset/image/card/spell/" + card.name} />
                <img className="card-spell__frame" src={"asset/image/card/spell frame " + classType} />
                <div className="card-spell__overlay">
                    <Mana card={card} />
                    <Name name={card.name} />
                    <Gem rarity={card.rarity} />
                    <Swirl />
                    <Description description={card.description} />
                </div>
            </div>
        );
    }
});

function Mana(props) {
    const card = props.card;
    const manaClassName = classNames({
        "card-spell__overlay__mana": true,
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
        <div className="card-spell__overlay__rarity">
            <img className="card-spell__overlay__rarity__bracket" src="/asset/image/card/spell gem brackets" />
            <img className="card-spell__overlay__rarity__gem" src={"/asset/image/card/gem " + props.rarity} />
        </div>
    );
}

function Swirl(props) {
    return <img className="card-spell__overlay__swirl" src="/asset/image/card/spell swirl basic" />;
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

        const textPath = "<textPath xlink:href=\"#spellCardNamePath\" startOffset=\"50%\">" + this.props.name + "</textPath>";

        return (
            <svg className="card-spell__overlay__name" viewBox="0 0 400 543">
                <defs>
                    <path id="spellCardNamePath" d="m 72.083772,305.1818 c 0,0 138.390898,-53.03301 268.195498,-1.01015"></path>
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
        <svg className="card-spell__overlay__description" viewBox="0 0 200 100">
            <foreignObject width="100%" height="100%">
                <div className="card-spell__overlay__description__text"><div>{props.description}</div></div>
            </foreignObject>
        </svg>
    );
}
