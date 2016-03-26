import React from "react";
import ReactDOM from "react-dom";

import MinionCard from "./minion";
import SpellCard from "./spell";

export default React.createClass({
    render: function () {
        if (this.props.card.type === "MINION") {
            return <MinionCard selectedCard={this.props.selectedCard} card={this.props.card} />;
        } else {
            return <SpellCard selectedCard={this.props.selectedCard} card={this.props.card} />;
        }
    }
});
