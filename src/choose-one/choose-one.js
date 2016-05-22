import React from "react";

import Backdrop from "../backdrop/backdrop";
import { isInChooseOneState } from "../game-state-utils";

export default function ChooseOne(props) {
    const game = props.game;

    return (
        <div>
            <Backdrop enabled={isInChooseOneState(game)} />
            <Options game={game} />
        </div>
    );
};

function Options(props) {
    const game = props.game;

    if (!isInChooseOneState(game)) {
        return <div></div>;
    }

    const options = game.gameBlocker.options.map((option) => {
        return (
            <li key={option.name}>
                <p>{option.name} | {option.description}</p>
            </li>
        );
    });

    return (
        <ol>{options}</ol>
    );
}
