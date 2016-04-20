import React from "react";
import ReactDOM from "react-dom";

import Minion from "./minion";

function mix(coll1, coll2) {
    const bigLength = Math.max(coll1.length, coll2.length);

    const output = [];

    for (var i = 0; i < bigLength; i++) {
        if (i < coll1.length) {
            output.push(coll1[i]);
        }

        if (i < coll2.length) {
            output.push(coll2[i]);
        }
    }

    return output;
}

export default function Battlefield(props) {
    var className = "battlefield";
    if (props.selectedCard && !props.selectedCard.isTargeting && (props.selectedCard.type === "SPELL")) {
        className = className + " targeting";
    }

    return (
        <div className={className} onClick={() => props.onBattlefieldClick()}>
            <Side
                imageProvider={props.imageProvider}
                minions={props.topMinions}
                showPositions={!props.bottomPlayerInTurn && props.selectedCard && props.selectedCard.type === "MINION"}
                onPositionClick={props.onPositionClick}
                onMinionClick={props.onMinionClick}
                selectedMinion={props.selectedMinion}
                selectedPosition={props.selectedPosition}
                selectedCard={props.selectedCard}
                selectedHeroPower={props.selectedHeroPower}
            />
            <Side
                imageProvider={props.imageProvider}
                minions={props.bottomMinions}
                showPositions={props.bottomPlayerInTurn && props.selectedCard && props.selectedCard.type === "MINION"}
                onPositionClick={props.onPositionClick}
                onMinionClick={props.onMinionClick}
                selectedMinion={props.selectedMinion}
                selectedPosition={props.selectedPosition}
                selectedCard={props.selectedCard}
                selectedHeroPower={props.selectedHeroPower}
            />
        </div>
    );
}

function Side(props) {
    const minions = props.minions.map(function (minion, position) {
        var className = "minion";

        if (minion.canAttack) {
            className += " can-attack";
        }

        if (props.selectedMinion && props.selectedMinion.validAttackIds.indexOf(minion.id) !== -1) {
            className += " valid-target";
        } else if (props.selectedCard && props.selectedCard.validTargetIds.indexOf(minion.id) !== -1) {
            if ((props.selectedCard.type === "MINION" && props.selectedPosition)
                || (props.selectedCard.type === "SPELL")) {
                className += " valid-target";
            }
        } else if (props.selectedHeroPower && props.selectedHeroPower.validTargetIds.indexOf(minion.id) !== -1) {
            className += " valid-target";
        }

        if (props.selectedMinion && props.selectedMinion.id === minion.id) {
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
        function Position(props) {
            var className = "position";

            if (props.selectedPosition === props.position) {
                className += " marked";
            }

            return <li className={className} onClick={() => props.onClick(props.position)}></li>;
        }

        positions =
            [<Position key={"position-0"} position={0} onClick={props.onPositionClick} selectedPosition={props.selectedPosition} />]
            .concat(props.minions.map((m) => {
                var pos = m.position + 1;
                return <Position key={"position-" + pos} position={pos} onClick={props.onPositionClick} selectedPosition={props.selectedPosition} />;
            }));
    }

    const lis = mix(positions, minions);

    return (
        <div className="side opponent">
            <ul>{lis}</ul>
        </div>
    );
}
