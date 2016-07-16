import React from "react";

import Card from "../card/card";
import Backdrop from "../backdrop/backdrop";
import { isInChooseOneState } from "../game-state-utils";

export default function ChooseOne(props) {
    const game = props.game;

    if (!isInChooseOneState(game)) {
        return <div></div>;
    }

    return (
        <div>
            <Backdrop enabled />
            <ol className="choose-one">
                {game.gameBlocker.options.map((option) => {
                    // We represent the option as a card, so we need to manufacter some card data in order to make it look like a spell card.
                    // TODO: The original game also presents the correct rarity and swirl.
                    var card = {
                        type: "SPELL",
                        name: option.name,
                        description: option.description,
                        manaCost: 0,
                        originalManaCost: 0,
                        playable: true
                    };

                    return (
                        <li className="choose-one__option" key={option.name} onClick={() => props.onChooseOne(option)}>
                            <Card card={card} />
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};
