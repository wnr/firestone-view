import React from "react";
import ReactDOM from "react-dom";

import { updateElement } from "../dom-utils";
import MinionCard from "./minion";
import SpellCard from "./spell";

export default React.createClass({
    render: function () {
        if (this.props.card.type === "MINION") {
            return <MinionCard card={this.props.card} />;
        } else {
            return <SpellCard card={this.props.card} />;
        }
    }
});
