export default function AudioHandler(config) {
    var assetProvider = config.assetProvider;

    function playMinionAttack(name) {
        assetProvider.loadAudio("sound/minion/" + name.replace(/ /g, "") + "Attack.ogg", function (audio) {
            audio.play();
        });
    }

    function playMinionPlayedToBoard(name) {
        assetProvider.loadAudio("sound/minion/" + name.replace(/ /g, "") + "Play.ogg", function (audio) {
            audio.play();
        });
    }

    function play(file) {
        assetProvider.loadAudio("sound/" + file, function (audio) {
            audio.play();
        });
    }

    return {
        playMinionAttack: playMinionAttack,
        playMinionPlayedToBoard: playMinionPlayedToBoard,
        play: play
    };
}