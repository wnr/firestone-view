var React = require("react");
var ReactDOM = require("react-dom");

import AssetLoader from "./asset-loader";
import ImageProvider from "./image-provider";

import Card from "./card";
import Hand from "./hand";
import Game from "./game";

var assetLoader = AssetLoader({
    assetBaseUrl: "../asset/"
});
var imageProvider = ImageProvider({
    assetLoader: assetLoader
});

function HelloWorld() {
    return (
        <Game imageProvider={imageProvider} />
    );
}

document.addEventListener("DOMContentLoaded", function (event) {
    var mainContainer = document.getElementById("main");
    ReactDOM.render(<HelloWorld />, mainContainer);
});
