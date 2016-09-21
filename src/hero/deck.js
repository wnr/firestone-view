import React from "react";

export default function Deck(props) {
    const deckSize = props.deckSize;

    return (
        <div className="deck">
            <img src="/asset/image/cardback.png" />
            <svg viewBox="0 0 200 100">
                <text x="100" y="50">{deckSize}</text>
            </svg>
        </div>
    );
}