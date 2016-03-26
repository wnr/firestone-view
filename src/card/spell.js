import React from "react";
import ReactDOM from "react-dom";

import { updateElement } from "../dom-utils";

export default React.createClass({
    componentDidMount: function () {
        this.draw(this.props.card);
    },
    render: function () {
        var cardWrapperStyle = {
            height: "210px",
            width: "156px"
        };

        var cardStyle = {
            position: "relative",
            width: "312px",
            height: "420px",
            transform: "scale(0.5)",
            transformOrigin: "top left"
        };

        var canvasStyle = {
            position: "absolute",
            left: "0px"
        };

        var frameStyle = {
            position: "absolute",
            width: "312px",
            left: "0px"
        };

        var overlayStyle = {
            position: "absolute",
            left: "15px",
            top: "-3px"
        };

        var card = this.props.card;

        var classType = card.class;

        if (!classType) {
            console.warn("Unknown class type for card ", card.name);
            classType = "mage";
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
                    <Outline card={this.props.card} selectedCard={this.props.selectedCard} />
                    <canvas ref="portraitCanvas" style={canvasStyle} width="290" height="300"></canvas>
                    <img src={"asset/image/card/spell frame " + classType} style={frameStyle} />
                    <div style={overlayStyle}>
                        <Mana value={card.manaCost} />
                        <Gem rarity={card.rarity} />
                        <Swirl />
                        <Name name={card.name} />
                        <Description description={card.description} />
                    </div>
                </div>
            </div>
        );
    },
    draw: function (card) {
        var canvas = this.refs.portraitCanvas;
        var ctx = canvas.getContext("2d");

        var img = new Image();
        img.onload = () => drawMinion(img)
        img.src = "/asset/image/card/spell/" + card.name;

        function drawMinion(img) {
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.rect(30, 32, 250, 200);
            ctx.closePath();

            ctx.clip();

            var zoom = 43;
            var imageWidth = img.width * zoom / 100;
            var imageHeight = img.height * zoom / 100;

            var imageX = 47;
            var imageY = 23;

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
            spread = "10px";
            color = "rgb(0,200,0)";
        }
    }

    var outlineStyle = {
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

function Gem(props) {
    if (!props.rarity) {
        return (<div></div>);
    }
    var bracketsStyle = {
        position: "absolute",
        width: "61px",
        height: "20px",
        top: "235px",
        left: "115px",
        backgroundImage: "url(\"asset/image/card/spell gem brackets\")"
    };

    var gemStyle = {
        position: "absolute",
        width: "29px",
        height: "34px",
        top: "9px",
        left: "19px",
        backgroundImage: "url(\"asset/image/card/gem " + props.rarity + "\")"
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
        left: "81px",
        top: "272px",
        backgroundImage: "url(\"asset/image/card/spell swirl basic\")"
    };

    return <div style={style}></div>;
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

        var textPath = "<textPath xlink:href=\"#spellCardNamePath\" startOffset=\"50%\">" + this.props.name + "</textPath>";

        return (
            <div style={style}>
                <svg width="312" height="424" viewBox="0 0 400 543">
                    <defs>
                        <path id="spellCardNamePath" d="m 72.083772,305.1818 c 0,0 138.390898,-53.03301 268.195498,-1.01015"></path>
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
            top: "278px",
            left: "46.5px",
            width: "196px",
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
