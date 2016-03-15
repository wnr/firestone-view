import React from "react";
import ReactDOM from "react-dom";

import Minion from "./minion";

export default function Battlefield(props) {
    return (
        <div className="battlefield">
            <Side
                imageProvider={props.imageProvider}
                minions={props.topMinions}
                showPositions={!props.bottomPlayerInTurn && props.showPositions}
                onPositionClick={props.onPositionClick}
                onMinionClick={props.onMinionClick}
                selectedMinion={props.selectedMinion}
            />
            <Side
                imageProvider={props.imageProvider}
                minions={props.bottomMinions}
                showPositions={props.bottomPlayerInTurn && props.showPositions}
                onPositionClick={props.onPositionClick}
                onMinionClick={props.onMinionClick}
                selectedMinion={props.selectedMinion}
            />
        </div>
    );
}

function Side(props) {
    var minions = props.minions.map(function (minion, position) {
        var className = "minion";

        if (minion.canAttack) {
            className += " can-attack";
        }

        if (minion.id === props.selectedMinion && props.selectedMinion.id) {
            className += " focused";
        }

        var firstPosition;
        if (props.showPositions) {
            firstPosition = <li key={minion.position} className="position" onClick={() => props.onPositionClick(position)}></li>;
        }

        var lastPosition;
        if (props.showPositions && position === props.minions.length - 1) {
            var lastPosition = <li key={position + 1} className="position" onClick={() => props.onPositionClick(position + 1)}></li>;
        }

        var minionLi = (
            <li key={minion.id} className={className} onClick={() => props.onMinionClick(minion)}>
                <Minion imageProvider={props.imageProvider} minion={minion} />
            </li>
        );

        return [firstPosition].concat(minionLi).concat(lastPosition);
    });

    return (
        <div className="side opponent">
            <ul>{minions}</ul>
        </div>
    );
}
