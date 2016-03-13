var React = require("react");
var ReactDOM = require("react-dom");

export default React.createClass({
    propTypes: {
        imageProvider: React.PropTypes.object.isRequired,
        card: React.PropTypes.object.isRequired
    },
    componentWillMount: function () {
        this.loadCanvas(this.props.card);
    },
    componentWillReceiveProps: function (nextProps) {
        this.loadCanvas(nextProps.card);
    },
    render: function () {
        return <div ref="canvasContainer"></div>;
    },
    loadCanvas: function (card) {
        this.props.imageProvider.getMinionCard(card, (canvas) => {
            var el = ReactDOM.findDOMNode(this);
            el.innerHTML = "";
            el.appendChild(canvas);
        });
    }
});
