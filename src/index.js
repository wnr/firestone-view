import React from "react";
import ReactDOM from "react-dom";

import AssetLoader from "./asset-loader";
import ImageProvider from "./image-provider";
import AudioHandler from "./audio-handler";

import Card from "./card";
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

function HelloWorld() {
    return (
        <Game imageProvider={imageProvider} audioHandler={audioHandler} />
    );
}

document.addEventListener("DOMContentLoaded", function (event) {
    var mainContainer = document.getElementById("main");
    ReactDOM.render(<HelloWorld />, mainContainer);
});
