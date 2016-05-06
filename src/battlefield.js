import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import Minion from "./minion/minion";

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
    const minions = props.minions;
    const onMinionClick = props.onMinionClick;
    const onPositionClick = props.onPositionClick;
    const selectedCard = props.selectedCard;
    const selectedHeroPower = props.selectedHeroPower;
    const selectedMinion = props.selectedMinion;
    const selectedPosition = props.selectedPosition;
    const showPositions = props.showPositions;

    const minionElements = minions.map(function (minion, position) {
        return (
            <li key={minion.id} onClick={() => props.onMinionClick(minion)}>
                <Minion
                    minion={minion}
                    selectedCard={selectedCard}
                    selectedHeroPower={selectedHeroPower}
                    selectedMinion={selectedMinion}
                    selectedPosition={selectedPosition}
                />
            </li>
        );

    });

    var positionElements = [];
    if (showPositions) {
        function Position(props) {
            const selectedPosition = props.selectedPosition;
            const position = props.position;

            const className = classNames({
                "position": true,
                "marked": selectedPosition === position // TODO: rename to selected.
            });

            return <li className={className} onClick={() => props.onClick(position)}></li>;
        }

        positionElements =
            [<Position key="position-0" position={0} onClick={onPositionClick} selectedPosition={selectedPosition} />]
            .concat(minions.map((m) => {
                const position = m.position + 1;
                return <Position key={"position-" + position} position={position} onClick={onPositionClick} selectedPosition={selectedPosition} />;
            }));
    }

    const lis = mix(positionElements, minionElements);

    return (
        <div className="side opponent">
            <ul>{lis}</ul>
        </div>
    );
}
