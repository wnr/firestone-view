import React from "react";
import ReactDOM from "react-dom";

export default React.createClass({
    propTypes: {
        imageProvider: React.PropTypes.object.isRequired,
        minion: React.PropTypes.object.isRequired
    },
    componentWillMount: function () {
        this.loadCanvas(this.props.minion);
    },
    componentWillReceiveProps: function (nextProps) {
        this.loadCanvas(nextProps.minion);
    },
    render: function () {
        return <div className="fade-in" ref="canvasContainer"></div>;
    },
    loadCanvas: function (minion) {
        this.props.imageProvider.getMinionInPlay(minion, (canvas) => {
            const el = ReactDOM.findDOMNode(this);
            el.innerHTML = "";
            el.appendChild(canvas);
        });
    }
});
