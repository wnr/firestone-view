import React from "react";
import ReactDOM from "react-dom";

import { updateElement } from "../dom-utils";
import MinionCard from "./minion";
import SpellCard from "./spell";

export default React.createClass({
    render: function () {
        if (this.props.card.type === "MINION") {
            return <div className="new"><MinionCard card={this.props.card} /></div>;
        } else {
            return <div className="new"><SpellCard card={this.props.card} /></div>;
        }
    }
});
