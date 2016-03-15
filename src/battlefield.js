import React from "react";
import ReactDOM from "react-dom";

import Minion from "./minion";

function mix(coll1, coll2) {
    var bigLength = Math.max(coll1.length, coll2.length);

    var output = [];

    for (var i = 0; i < bigLength; i++) {
        if (i < coll1.length) {
            output.push(coll1[i]);
        }

        if (i < coll2.length) {
            output.push(coll2[i]);
        }
    }

    console.log(output);

    return output;
}

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

        return (
            <li key={minion.id} className={className} onClick={() => props.onMinionClick(minion)}>
                <Minion imageProvider={props.imageProvider} minion={minion} />
            </li>
        );
    });

    var positions = [];
    if (props.showPositions) {
        positions =
            [<li key={"position-" + 0} className="position" onClick={() => props.onPositionClick(0)}></li>]
            .concat(props.minions.map((m) => {
                return <li key={"position-" + m.position + 1} className="position" onClick={() => props.onPositionClick(m.position + 1)}></li>;
            }));
    }

    var lis = mix(positions, minions);

    return (
        <div className="side opponent">
            <ul>{lis}</ul>
        </div>
    );
}
