import React from "react";
import ReactDOM from "react-dom";

import MinionCard from "./minion";
import SpellCard from "./spell";

export default React.createClass({
    render: function () {
        if (this.props.card.type === "minion") {
            return <MinionCard {...this.props} />;
        } else {
            return <SpellCard {...this.props} />;
        }
    }
});
