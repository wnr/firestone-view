var React = require("react");
var ReactDOM = require("react-dom");

import Minion from "./minion";

export default function Battlefield(props) {
    return (
        <div className="battlefield">
            <Side imageProvider={props.imageProvider} minions={props.topMinions} />
            <Side imageProvider={props.imageProvider} minions={props.bottomMinions} />
        </div>
    );
}

function Side(props) {
    var minions = props.minions.map(function (minion) {
        var className = "minion";

        return (
            <li key={minion.id} className={className}>
                <Minion imageProvider={props.imageProvider} minion={minion} />
            </li>
        );
    });

    return (
        <div className="side opponent">
            <ul>{minions}</ul>
        </div>
    );
}
