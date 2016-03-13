var React = require("react");
var ReactDOM = require("react-dom");

export default React.createClass({
    propTypes: {
        imageProvider: React.PropTypes.object.isRequired,
        hero: React.PropTypes.object.isRequired
    },
    componentDidMount: function () {
        this.loadCanvas(this.props.hero);
    },
    componentWillReceiveProps: function (nextProps) {
        this.loadCanvas(nextProps.hero);
    },
    render: function () {
        return (
            <div className="hero-container">
                <div className="left-container">
                    <div ref="manaCanvasContainer" className="mana"></div>
                </div>
                <div ref="portraitCanvasContainer" className="face"></div>
                <div className="right-container">
                </div>
            </div>
        );
    },
    loadCanvas: function (hero) {
        var portraitCanvasContainer = this.refs.portraitCanvasContainer;
        var manaCanvasContainer = this.refs.manaCanvasContainer;

        var manaString = hero.mana + "/" + hero.maxMana;

        this.props.imageProvider.getHero(hero, updateElement.bind(null, portraitCanvasContainer));
        this.props.imageProvider.getManaStone(manaString, updateElement.bind(null, manaCanvasContainer));

        function updateElement(el, canvas) {
            el.innerHTML = "";
            el.appendChild(canvas);
        }
    }
});
