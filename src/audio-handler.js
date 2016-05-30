export default function AudioHandler(config) {
    const assetProvider = config.assetProvider;

    function playCharacterAttack(name) {
        assetProvider.loadAudio("sound/minion/" + name + "Attack", function (audio) {
            audio.play();
        });
    }

    function playMinionPlayedToBoard(name) {
        assetProvider.loadAudio("sound/minion/" + name + "Play", function (audio) {
            audio.play();
        });
    }

    function playWeaponPlayed(name) {
        // TODO
    }

    function playMinionTrigger(name) {
        assetProvider.loadAudio("sound/minion/" + name + "Trigger", function (audio) {
            audio.play();
        });
    }

    function play(file) {
        assetProvider.loadAudio("sound/" + file, function (audio) {
            audio.play();
        });
    }

    return {
        playCharacterAttack: playCharacterAttack,
        playMinionPlayedToBoard: playMinionPlayedToBoard,
        playMinionTrigger: playMinionTrigger,
        playWeaponPlayed: playWeaponPlayed,
        play: play
    };
}
