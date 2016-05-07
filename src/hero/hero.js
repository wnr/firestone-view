import React from "react";
import ReactDOM from "react-dom";

import { updateElement } from "../dom-utils";
import HeroPower from "./hero-power";

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
        const props = this.props;

        var heroClassName = "face";

        if (props.selectedMinion && props.selectedMinion.validAttackIds.indexOf(props.hero.id) !== -1) {
            // Minion is selected for attack and the hero is a valid target.
            heroClassName += " valid-target";
        } else if (props.selectedCard && props.selectedCard.isTargeting && props.selectedCard.validTargetIds.indexOf(props.hero.id) !== -1) {
            // Card is selected to be played, which is targeting, and the hero is a valid target.
            heroClassName += " valid-target";
        } else if (props.selectedHeroPower && props.selectedHeroPower.isTargeting && props.selectedHeroPower.validTargetIds.indexOf(props.hero.id) !== -1) {
            // Hero power is selected, which is targeting, and the hero is a valid target.
            heroClassName += " valid-target";
        }

        const scale = 0.3;
        const width = 391;
        const height = 452;

        const faceWrapperStyle = {
            width: `${scale * width}px`,
            height: `${scale * height}px`
        };

        const faceStyle = {
            position: "relative",
            width: `${width}px`,
            height: `${height}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left"
        }

        const frameStyle = {
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
                <div className="right-container" onClick={() => props.onHeroPowerClick(props.hero.heropower)}>
                    <div style={{"height": "95px"}}>
                        <HeroPower heroPower={props.hero.heropower} selectedHeroPower={props.selectedHeroPower} />
                    </div>
                </div>
            </div>
        );
    },
    draw: function (hero) {
        const props = this.props;

        function drawFace(canvas) {
            const ctx = canvas.getContext("2d");

            const img = new Image();
            img.onload = () => drawPortrait(img)

            img.src = "/asset/image/hero/" + props.hero.name + ".png";

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
            const manaString = hero.mana + "/" + hero.maxMana;

            props.imageProvider.getManaStone(manaString, updateElement.bind(null, canvas));
        }

        drawFace(this.refs.portrait);
        drawMana(this.refs.manaCanvasContainer);
    }
});

function Health(props) {
    const style = {
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

    const textStyle = {
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
    };

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

    const style = {
        position: "absolute",
        transform: "scale(1.1)",
        bottom: "93px",
        right: "-23px",
        width: "98",
        height: "115px",
        backgroundImage: "url(\"/asset/image/armor.png\")"
    };

    const textStyle = {
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
