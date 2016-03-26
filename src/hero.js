import React from "react";
import ReactDOM from "react-dom";

import { updateElement } from "./dom-utils";

export default React.createClass({
    propTypes: {
        imageProvider: React.PropTypes.object.isRequired,
        hero: React.PropTypes.object.isRequired
    },
    componentDidMount: function () {
        this.draw(this.props.hero);
    },
    componentWillReceiveProps: function (nextProps) {
        this.draw(nextProps.hero);
    },
    render: function () {
        var props = this.props;

        var heroClassName = "face";

        if (props.selectedMinion && props.selectedMinion.validAttackIds.indexOf(props.hero.id) !== -1) {
            heroClassName += " valid-target";
        } else if (props.selectedCard && props.selectedCard.isTargeting && props.selectedCard.validTargetIds.indexOf(props.hero.id) !== -1) {
            heroClassName += " valid-target";
        }

        var scale = 0.3;
        var width = 391;
        var height = 452;

        var faceWrapperStyle = {
            width: `${scale * width}px`,
            height: `${scale * height}px`
        };

        var faceStyle = {
            position: "relative",
            width: `${width}px`,
            height: `${height}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left"
        }

        var frameStyle = {
            position: "absolute",
            width: "391px",
            left: "452px",
            left: "0px"
        };

        return (
            <div className="hero-container">
                <div className="left-container">
                    <div ref="manaCanvasContainer" className="mana"></div>
                </div>
                <div style={faceWrapperStyle} className={heroClassName} onClick={() => props.onHeroClick(props.hero)}>
                    <div style={faceStyle}>
                        <canvas ref="portrait" width="391" height="452" />
                        <img src="/asset/image/hero frame.png" style={frameStyle} />
                        <Health health={props.hero.health} maxHealth={props.hero.maxHealth} />
                        <Armor armor={props.hero.armor} />
                    </div>
                </div>
                <div className="right-container">
                </div>
            </div>
        );
    },
    draw: function (hero) {
        var props = this.props;

        function drawFace(canvas) {
            var ctx = canvas.getContext("2d");

            var img = new Image();
            img.onload = () => drawPortrait(img)
            img.src = "/asset/image/hero/jaina.png";

            function drawPortrait() {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(220, 10);
                ctx.lineTo(350, 160);
                ctx.lineTo(380, 480);
                ctx.lineTo(0, 460);
                ctx.lineTo(20, 140);
                ctx.lineTo(180, 20);
                ctx.closePath();
                ctx.clip();

                ctx.drawImage(img, 0, 0, img.width, img.height, 30, 50, img.width*0.7, img.height*0.7);

                ctx.restore();
            }
        }

        function drawMana(canvas) {
            var manaString = hero.mana + "/" + hero.maxMana;

            props.imageProvider.getManaStone(manaString, updateElement.bind(null, canvas));
        }

        drawFace(this.refs.portrait);
        drawMana(this.refs.manaCanvasContainer);
    }
});

function Health(props) {
    var style = {
        position: "absolute",
        transform: "scale(0.45)",
        bottom: "-120px",
        right: "-78px",
        width: "202px",
        height: "288px",
        backgroundImage: "url(\"/asset/image/health.png\")"
    };

    var healthColor = "white";

    if (props.health < props.maxHealth) {
        healthColor = "red";
    }

    var textStyle = {
        position: "relative",
        display: "block",
        top: "35px",
        textAlign: "center",
        color: healthColor,
        fontSize: "200px",
        fontFamily: "Belwe",
        WebkitTextStrokeWidth: "8px",
        WebkitTextStrokeColor: "black",
        textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
    }

    return (
        <div style={style}>
            <div style={textStyle}>{props.health}</div>
        </div>
    );
}

function Armor(props) {
    if (!props.armor) {
        return <div></div>;
    }

    var style = {
        position: "absolute",
        transform: "scale(1.1)",
        bottom: "93px",
        right: "-23px",
        width: "98",
        height: "115px",
        backgroundImage: "url(\"/asset/image/armor.png\")"
    };

    var textStyle = {
        position: "relative",
        display: "block",
        top: "0px",
        textAlign: "center",
        color: "white",
        fontSize: "80px",
        fontFamily: "Belwe",
        WebkitTextStrokeWidth: "3px",
        WebkitTextStrokeColor: "black",
        textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
    }

    return (
        <div style={style}>
            <div style={textStyle}>{props.armor}</div>
        </div>
    );
}
