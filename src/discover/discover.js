import React from "react";

import Card from "../card/card";
import Backdrop from "../backdrop/backdrop";
import * as stateUtils from "../game-state-utils";

export default function Discover(props) {
    const game = props.game;

    if (!stateUtils.isInDiscoverState(game)) {
        return <div></div>;
    }

    return (
        <div>
            <Backdrop enabled />
            <ol className="discover">
                {game.gameBlocker.options.map((option) => {
                    if (stateUtils.isCard(option)) {
                        return (
                            <li className="discover__option" key={option.name} onClick={() => props.onDiscover(option)}>
                                <Card card={option} glow />
                            </li>
                        );
                    } else {
                        throw new Error("Unhandled Discover option type.");
                    }
                })}
            </ol>
        </div>
    );
};
