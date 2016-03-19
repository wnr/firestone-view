import React from "react";
import ReactDOM from "react-dom";

import AssetLoader from "./asset-loader";
import ImageProvider from "./image-provider";
import AudioHandler from "./audio-handler";

import Card from "./card/card";
import Hand from "./hand";
import Game from "./game";

var assetLoader = AssetLoader({
    assetBaseUrl: "../asset/"
});
var imageProvider = ImageProvider({
    assetLoader: assetLoader
});
var audioHandler = AudioHandler({
    assetProvider: assetLoader
});

function Root() {
    // return <Card imageProvider={imageProvider} card={{
    //     name: "Imp Gang Boss",
    //     description: "Whenever this minion takes damage, summon a 1/1 Imp.",
    //     attack: 2,
    //     health: 4,
    //     mana: 4,
    //     race: "Demon",
    //     type: "MINION"
    // }} />;

    return (
        <Game imageProvider={imageProvider} audioHandler={audioHandler} />
    );
}

document.addEventListener("DOMContentLoaded", function (event) {
    var mainContainer = document.getElementById("main");
    ReactDOM.render(<Root />, mainContainer);
});
