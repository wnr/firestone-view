var React = require("react");
var ReactDOM = require("react-dom");

import AssetLoader from "./asset-loader";
import ImageProvider from "./image-provider";

import Card from "./card";

var assetLoader = AssetLoader({
    assetBaseUrl: "../asset/"
});
var imageProvider = ImageProvider({
    assetLoader: assetLoader
});

function HelloWorld() {
    return (
        <Card imageProvider={imageProvider} name="Imp" />
    );
}

document.addEventListener("DOMContentLoaded", function (event) {
    var mainContainer = document.getElementById("main");
    ReactDOM.render(<HelloWorld />, mainContainer);
});
