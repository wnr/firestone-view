import React from "react";
import ReactDOM from "react-dom";

import AssetLoader from "./asset-loader";
import ImageProvider from "./image-provider";
import AudioHandler from "./audio-handler";

import Game from "./game";

const assetLoader = AssetLoader({
    assetBaseUrl: "../asset/"
});
const imageProvider = ImageProvider({
    assetLoader: assetLoader
});
const audioHandler = AudioHandler({
    assetProvider: assetLoader
});

function Root() {
    return (
        <Game imageProvider={imageProvider} audioHandler={audioHandler} />
    );
}

document.addEventListener("DOMContentLoaded", function (event) {
    var mainContainer = document.getElementById("main");
    ReactDOM.render(<Root />, mainContainer);
});
