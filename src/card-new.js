import React from "react";
import ReactDOM from "react-dom";

import { updateElement } from "./dom-utils";

var cards = require("./card-art.json");

export default React.createClass({
    render: function () {
        return <MinionCard />;
    }
});

var MinionCard = React.createClass({
    getDefaultProps: function () {
        return {
            card: {
                name: "Imp Gang Boss",
                description: "Whenever this minion takes damage, summon a 1/1 Imp.",
                attack: 2,
                health: 4,
                mana: 4,
                race: "Demon"
            }
        };
    },
    componentDidMount: function () {
        this.draw(this.props.card);
    },
    render: function () {
        var cardWrapperStyle = {
            position: "absolute",
            height: "400px"
        };

        var canvasStyle = {
            position: "absolute",
            left: "0px"
        };

        var portraitStyle = {
            position: "absolute",
            width: "312px"
        };

        var overlayStyle = {
            position: "absolute",
            left: "15px",
            top: "-3px"
        };

        var card = this.props.card;

        return (
            <div ref="cardWrapper" style={cardWrapperStyle}>
                <canvas ref="portraitCanvas" style={canvasStyle} width="290" height="300"></canvas>
                <img src="http://www.hearthcards.net/card_js_templates/card_minion_warlock.png" style={portraitStyle} />
                <div style={overlayStyle}>
                    <Mana value={card.mana} />
                    <Attack value={card.attack} />
                    <Health value={card.health} />
                    <Gem />
                    <Swirl />
                    <Race race={card.race} />
                    <Name name={card.name} />
                    <Description description={card.description} />
                </div>
            </div>
        );
    },
    draw: function (card) {
        var cardArtObj = cards[card.name];

        if (!cardArtObj || !cardArtObj.art) {
            console.error("Failed to find card art for minion", card.name);
        }

        var art = cardArtObj.art;

        var canvas = this.refs.portraitCanvas;
        var ctx = canvas.getContext("2d");

        var img = new Image();
        img.onload = () => drawMinion(img)
        img.src = "http://www.hearthcards.net/art/" + art + ".png";

        function drawMinion(img) {
            ctx.restore();

            // clear the canvas

            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(157, 4);
            ctx.bezierCurveTo(52, 4, 52, 240, 157, 240);
            ctx.bezierCurveTo(280, 240, 280, 4, 157, 4);
            ctx.closePath();
            ctx.clip();

            var zoom = 48;
            var imageWidth = img.width * zoom / 100;
            var imageHeight = img.height * zoom / 100;

            var imageX = 40;
            var imageY = 4;

            // draw the image
            ctx.drawImage(img, 0, 0, img.width, img.height, imageX, imageY, imageWidth, imageHeight);
        }
    }
});

function getStatsBaseStyle(top, left) {
    return {
        position: "absolute",
        display: "block",
        top: top,
        left: left,
        width: "76px",
        textAlign: "center",
        color: "white",
        fontSize: "70px",
        fontFamily: "Belwe",
        WebkitTextStrokeWidth: "2px",
        WebkitTextStrokeColor: "black",
        textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
    };
}

function Mana(props) {
    return <div style={getStatsBaseStyle("-4px", "-5px")}>{props.value}</div>;
}

function Attack(props) {
    return <div style={getStatsBaseStyle("332px")}>{props.value}</div>;
}

function Health(props) {
    return <div style={getStatsBaseStyle("334px", "221px")}>{props.value}</div>;
}

function Gem(props) {
    var bracketsStyle = {
        position: "absolute",
        width: "61px",
        height: "20px",
        top: "240px",
        left: "129px",
        backgroundImage: "url(\"http://www.hearthcards.net/card_js_templates/minion_gem_brackets.png\")"
    };

    var gemStyle = {
        position: "absolute",
        width: "29px",
        height: "34px",
        top: "3px",
        left: "11px",
        backgroundImage: "url(\"http://www.hearthcards.net/card_js_templates/gem_common.png\")"
    };

    return (
        <div style={bracketsStyle}>
            <div style={gemStyle}></div>
        </div>
    );
}

function Swirl(props) {
    var style = {
        position: "absolute",
        width: "137px",
        height: "108px",
        left: "84px",
        top: "271px",
        backgroundImage: "url(\"http://www.hearthcards.net/card_js_templates/on_card_swirl_blackrock_minion.png\")"
    };

    return <div style={style}></div>;
}

function Race(props) {
    var frameStyle = {
        position: "absolute",
        width: "156px",
        height: "36px",
        left: "73px",
        top: "363px",
        backgroundImage: "url(\"http://www.hearthcards.net/card_js_templates/card_race.png\")"
    };

    var textStyle = {
        position: "absolute",
        width: "156px",
        textAlign: "center",
        top: "7px",
        color: "white",
        fontSize: "20px",
        fontFamily: "Belwe",
        textShadow: "1.5px 1.5px 0 #000, -1.5px -1px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000"
    };

    return (
        <div style={frameStyle}>
            <div style={textStyle}>{props.race}</div>
        </div>
    );
}

var Name = React.createClass({
    componentDidMount: function () {
        this.adjustFontSize();
    },
    render: function () {
        var style = {
            position: "absolute",
            top: "3px",
            left: "-14px"
        };

        var textPath = "<textPath xlink:href=\"#minionCardNamePath\" startOffset=\"50%\">" + this.props.name + "</textPath>";

        return (
            <div style={style}>
                <svg width="312" height="424" viewBox="0 0 400 543">
                    <defs>
                        <path id="minionCardNamePath" d="m 56.336299,307.51481 c 0,0 3.8284,6.45932 52.003431,0.99221 28.84576,-3.27354 57.87325,-12.4128 107.80271,-18.66988 36.69487,-4.59854 72.68333,-5.86349 97.95307,-1.16154 27.31819,5.0831 43.46829,12.47526 43.46829,12.47526"></path>
                    </defs>
                    <text ref="name" fontFamily="Belwe" fontSize="30" fill="white" stroke="black" strokeWidth="5" textAnchor="middle" dangerouslySetInnerHTML={{__html: textPath }}></text>
                    <text ref="nameShadow" fontFamily="Belwe" fontSize="30" fill="white" textAnchor="middle" dangerouslySetInnerHTML={{__html: textPath }}></text>
                </svg>
            </div>
        );
    },
    adjustFontSize: function (cardtype, title) {
        var nameNode = this.refs.name;
        var nameShadowNode = this.refs.nameShadow;

        var fsize = nameNode.getAttribute("font-size");
        var bbox = nameNode.getBBox();
        var width = bbox.width;
        var maxTitleSize = 295;

        if (width < maxTitleSize - 50) {
            nameNode.setAttribute("font-size", "30");
            nameShadowNode.setAttribute("font-size", "30");
        }

        while (width > maxTitleSize) {
            var fsize = fsize - 1;
            nameNode.setAttribute("font-size", fsize);
            nameShadowNode.setAttribute("font-size", fsize);
            var bbox = nameNode.getBBox();
            var width = bbox.width;
        }
    }
});

var Description = React.createClass({
    render: function () {
        var style = {
            position: "absolute",
            display: "table",
            top: "269px",
            left: "38.5px",
            width: "215px",
            height: "100px",
            textAlign: "center",
            boxSizing: "border-box",
            fontFamily: "franklinGothic",
            fontSize: "20px",
            lineHeight: "1"
        };

        var spanStyle = {
            display: "table-cell",
            verticalAlign: "middle"
        };

        return (
            <div style={style}><span style={spanStyle}>{this.props.description}</span></div>
        );
    }
});
