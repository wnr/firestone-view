var React = require("react");
var ReactDOM = require("react-dom");

import Minion from "./minion";

export default function Battlefield(props) {
    return (
        <div className="battlefield">
            <Side
                imageProvider={props.imageProvider}
                minions={props.topMinions}
                showPositions={!props.bottomPlayerInTurn && props.showPositions}
                onPositionClick={props.onPositionClick}
            />
            <Side
                imageProvider={props.imageProvider}
                minions={props.bottomMinions}
                showPositions={props.bottomPlayerInTurn && props.showPositions}
                onPositionClick={props.onPositionClick}
            />
        </div>
    );
}

function Side(props) {
    var minions = props.minions.map(function (minion, position) {
        var className = "minion";

        var firstPosition;
        if (props.showPositions) {
            firstPosition = <li key={minion.position} className="position" onClick={() => props.onPositionClick(position)}></li>;
        }

        var lastPosition;
        if (props.showPositions && position === props.minions.length - 1) {
            var lastPosition = <li key={position + 1} className="position" onClick={() => props.onPositionClick(position + 1)}></li>;
        }

        var minion = (
            <li key={minion.id} className={className}>
                <Minion imageProvider={props.imageProvider} minion={minion} />
            </li>
        );

        return [firstPosition].concat(minion).concat(lastPosition);
    });

    return (
        <div className="side opponent">
            <ul>{minions}</ul>
        </div>
    );
}
