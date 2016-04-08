import React from "react";
import ReactDOM from "react-dom";

import { updateElement } from "../dom-utils";

export default React.createClass({
    componentDidMount: function () {
        this.draw(this.props.card);
    },
    render: function () {
        const cardWrapperStyle = {
            height: "210px",
            width: "156px"
        };

        const cardStyle = {
            position: "relative",
            width: "312px",
            height: "420px",
            transform: "scale(0.5)",
            transformOrigin: "top left"
        };

        const canvasStyle = {
            position: "absolute",
            left: "0px"
        };

        const frameStyle = {
            position: "absolute",
            width: "312px",
            left: "0px"
        };

        const overlayStyle = {
            position: "absolute",
            left: "15px",
            top: "-3px"
        };

        const card = this.props.card;

        var classType = "neutral";

        if (card.class) {
            classType = card.class;
        }

        var className = "card minion ";

        if (card.playable) {
            className += " playable";
        }

        if (this.props.selectedCard && this.props.selectedCard.id === card.id) {
            className += " focused"
        }

        return (
            <div className={className} style={cardWrapperStyle}>
                <div style={cardStyle}>
                    <Outline card={card} selectedCard={this.props.selectedCard} />
                    <canvas ref="portraitCanvas" style={canvasStyle} width="290" height="300"></canvas>
                    <img src={"/asset/image/card/minion frame " + classType} style={frameStyle} />
                    <div style={overlayStyle}>
                        <Mana value={card.manaCost} originalValue={card.originalManaCost}/>
                        <Attack value={card.attack} />
                        <Health value={card.health} />
                        <Gem rarity={card.rarity} />
                        <Dragon rarity={card.rarity} />
                        <Swirl />
                        <Race race={card.race} />
                        <Name name={card.name} />
                        <Description description={card.description} />
                    </div>
                </div>
            </div>
        );
    },
    draw: function (card) {
        const canvas = this.refs.portraitCanvas;
        const ctx = canvas.getContext("2d");

        const img = new Image();
        img.onload = () => drawMinion(img)
        img.src = "/asset/image/card/minion/" + card.name;

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

            const zoom = 48;
            const imageWidth = img.width * zoom / 100;
            const imageHeight = img.height * zoom / 100;

            const imageX = 40;
            const imageY = 4;

            // draw the image
            ctx.drawImage(img, 0, 0, img.width, img.height, imageX, imageY, imageWidth, imageHeight);
        }
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
            color = "rgb(0,255,0)";
        } else {
            blur = "20px";
            spread = "8px";
            color = "rgb(0,200,0)";
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

function getStatsBaseStyle(top, left, color) {
    return {
        position: "absolute",
        display: "block",
        top: top,
        left: left,
        width: "76px",
        textAlign: "center",
        color: color || "white",
        fontSize: "70px",
        fontFamily: "Belwe",
        WebkitTextStrokeWidth: "2px",
        WebkitTextStrokeColor: "black",
        textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
    };
}

function Mana(props) {
    if (props.value < props.originalValue) {
        return <div style={getStatsBaseStyle("-4px", "-5px", "lightgreen")}>{props.value}</div>;
    } else if (props.value > props.originalValue) {
        return <div style={getStatsBaseStyle("-4px", "-5px", "red")}>{props.value}</div>;
    } else{
        return <div style={getStatsBaseStyle("-4px", "-5px")}>{props.value}</div>;
    }
}

function Attack(props) {
    return <div style={getStatsBaseStyle("332px")}>{props.value}</div>;
}

function Health(props) {
    return <div style={getStatsBaseStyle("334px", "221px")}>{props.value}</div>;
}

function Gem(props) {
    if (!props.rarity) {
        return (<div></div>);
    }
    const bracketsStyle = {
        position: "absolute",
        width: "61px",
        height: "20px",
        top: "240px",
        left: "129px",
        backgroundImage: "url(\"asset/image/card/minion gem brackets\")"
    };

    const gemStyle = {
        position: "absolute",
        width: "29px",
        height: "34px",
        top: "3px",
        left: "11px",
        backgroundImage: "url(\"asset/image/card/gem " + props.rarity + "\")"
    };

    return (
        <div style={bracketsStyle}>
            <div style={gemStyle}></div>
        </div>
    );
}

function Dragon(props) {
    if (props.rarity !== "legendary") {
        return <div></div>;
    } else {
        const dragonTopStyle = {
            position: "absolute",
            width: "234px",
            height: "174px",
            top: "-19px",
            left: "65px",
            backgroundImage: "url(\"asset/image/card/minion frame dragon bracket\")"
        };

        return (
            <div style={dragonTopStyle}></div>
        );
    }
}

function Swirl(props) {
    const style = {
        position: "absolute",
        width: "137px",
        height: "108px",
        left: "84px",
        top: "271px",
        backgroundImage: "url(\"asset/image/card/minion swirl blackrock\")"
    };

    return <div style={style}></div>;
}

function Race(props) {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const frameStyle = {
        position: "absolute",
        width: "156px",
        height: "36px",
        left: "73px",
        top: "363px",
        backgroundImage: "url(\"asset/image/card/minion race\")"
    };

    const textStyle = {
        position: "absolute",
        width: "156px",
        textAlign: "center",
        top: "7px",
        color: "white",
        fontSize: "20px",
        fontFamily: "Belwe",
        textShadow: "1.5px 1.5px 0 #000, -1.5px -1px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000"
    };

    if (!props.race) {
        return <div></div>;
    }

    return (
        <div style={frameStyle}>
            <div style={textStyle}>{capitalizeFirstLetter(props.race)}</div>
        </div>
    );
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

        const textPath = "<textPath xlink:href=\"#minionCardNamePath\" startOffset=\"50%\">" + this.props.name + "</textPath>";

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

var Description = React.createClass({
    render: function () {
        const style = {
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

        const spanStyle = {
            display: "table-cell",
            verticalAlign: "middle"
        };

        return (
            <div style={style}><span style={spanStyle}>{this.props.description}</span></div>
        );
    }
});
