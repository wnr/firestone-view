var React = require("react");
var ReactDOM = require("react-dom");

export default React.createClass({
    propTypes: {
        imageProvider: React.PropTypes.object.isRequired
    },
    componentWillMount: function () {
        this.loadCanvas({
            name: "Imp",
            description: "Ugly little thing",
            manaCost: 1,
            attack: 1,
            health: 1
        });
    },
    render: function () {
        return <div ref="canvasContainer">Loading...</div>;
    },
    loadCanvas: function (card) {
        this.props.imageProvider.getMinionCard(card, (canvas) => {
            var el = ReactDOM.findDOMNode(this);
            el.innerHTML = "";
            el.appendChild(canvas);
        });
    }
});
