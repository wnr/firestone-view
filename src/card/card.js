import React from "react";
import ReactDOM from "react-dom";

import { updateElement } from "../dom-utils";
import MinionCard from "./minion";

export default React.createClass({
    render: function () {
        if (this.props.card.type === "MINION") {
            return <div className="new"><MinionCard card={this.props.card} /></div>;
        } else {
            return <SpellCard card={this.props.card} imageProvider={this.props.imageProvider} />;
        }
    }
});

var SpellCard = React.createClass({
    propTypes: {
        imageProvider: React.PropTypes.object.isRequired,
        card: React.PropTypes.object.isRequired
    },
    componentWillMount: function () {
        this.loadCanvas(this.props.card);
    },
    componentWillReceiveProps: function (nextProps) {
        this.loadCanvas(nextProps.card);
    },
    render: function () {
        return <div className="old" ref="canvasContainer"></div>;
    },
    loadCanvas: function (card) {
        if (card.type === "MINION") {
            this.props.imageProvider.getMinionCard(card, (canvas) => {
                var el = ReactDOM.findDOMNode(this);
                updateElement(el, canvas);
            });
        } else if (card.type === "SPELL") {
            this.props.imageProvider.getSpellCard(card, (canvas) => {
                var el = ReactDOM.findDOMNode(this);
                updateElement(el, canvas);
            });
        } else {
            console.error("Invalid card type.", card);
        }

    }
});
