var ReactDOM = require("react-dom");
var React = require("react");

function HelloWorld() {
    return (
        <p>Hello World</p>
    );
}

document.addEventListener("DOMContentLoaded", function (event) {
    var mainContainer = document.getElementById("main");
    ReactDOM.render(<HelloWorld />, mainContainer);
});
