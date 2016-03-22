export default function ImageProvider(options) {
    var assetLoader = options.assetLoader;

    function getPortraitUrl(minion) {
        return "image/card/portrait/" + minion.name.replace(/ /g, "") + ".png";
    }

    function drawScaledImage(context, image, scale, offsetX, offsetY) {
        offsetX = offsetX || 0;
        offsetY = offsetY || 0;

        var width = image.width * scale;
        var height = image.height * scale;
        var marginX = (image.width - width) / 2;
        var marginY = (image.height - height) / 2;

        context.drawImage(image, offsetX + marginX, offsetY + marginY, width, height);
    }

    function getMinionInPlay(minion, callback) {
        assetLoader.loadImages([getPortraitUrl(minion), "image/card/effect.png", "image/card/deathrattle.png", "image/card/taunt.png", "image/card/Minion_Frame.png", "image/card/attack.png", "image/card/health.png"], function createMinionInPlayCanvas(portrait, effect, deathrattle, tauntFrame, frame, attack, health) {
            var canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 650;
            var context = canvas.getContext("2d");

            if (minion.states.indexOf("TAUNT") >= 0) {
                drawScaledImage(context, tauntFrame, 2.35, 130, 215);
            }

            if (portrait) {
                context.save();
                context.beginPath();
                context.ellipse(260, 310, 160, 220, 0, 0, Math.PI*2);
                context.clip();

                drawScaledImage(context, portrait, 0.85, 0, 60);
                context.restore();
            }

            context.drawImage(frame, 0, 60, 512, 512);

            context.font = "100px belwe";
            context.lineWidth = 3;

            drawScaledImage(context, attack, 0.5, -120, 200);

            if (minion.attack > minion.originalAttack) {
                context.fillStyle = "lightgreen";
            } else {
                context.fillStyle = "white";
            }

            context.fillText(minion.attack, 118, 490);
            context.strokeText(minion.attack, 118, 490);

            drawScaledImage(context, health, 0.5, 120, 200);

            if (minion.health < minion.maxHealth) {
                context.fillStyle = "red";
            } else if (minion.health === minion.maxHealth && minion.health > minion.originalHealth) {
                context.fillStyle = "lightgreen";
            } else {
                context.fillStyle = "white";
            }

            context.fillText(minion.health, 350, 490);
            context.strokeText(minion.health, 350, 490);

            if (minion.states.indexOf("DIVINE_SHIELD") >= 0) {
                context.save();
                context.beginPath();
                var scale = 1.4;
                context.ellipse(260, 320, 160*scale, 220*scale, 0, 0, Math.PI*2);
                context.fillStyle = "rgba(255, 200, 0, 0.4)";
                context.fill();
                context.restore();
            }

            if (minion.states.indexOf("DEATHRATTLE") >= 0) {
                drawScaledImage(context, deathrattle, 0.5, 132, 400);
            }

            if (minion.states.indexOf("EFFECT") >= 0) {
                drawScaledImage(context, effect, 1, 210, 480);
            }

            callback(canvas);
        });
    }

    function getMinionCard(minionCard, callback) {
        assetLoader.loadImages([getPortraitUrl(minionCard), "image/card/Card_Frame.png", "image/mana.png", "image/card/attack.png", "image/card/health.png"], function (portrait, frame, mana, attack, health) {
            var descriptionImageWidth = 250;
            var descriptionImageHeight = 130;
            var descriptionImageFontSize = 28;
            convertHtmlToImage(minionCard.description, descriptionImageWidth, descriptionImageHeight, descriptionImageFontSize, function (descriptionImage) {
                var canvas = document.createElement("canvas");
                canvas.width = 512;
                canvas.height = 550;
                var context = canvas.getContext("2d");

                if (portrait) {
                    context.save();
                    context.beginPath();
                    context.ellipse(260, 240, 160, 220, 0, 0, Math.PI*2);
                    context.clip();

                    drawScaledImage(context, portrait, 0.6, 0, -100);

                    context.restore();
                }

                context.drawImage(frame, 0, 0, 512, 512);

                context.drawImage(descriptionImage, 130, 340, descriptionImageWidth, descriptionImageHeight);

                drawScaledImage(context, mana, 1, 65, 10);
                context.strokeStyle = "black";
                context.fillStyle = "white";
                context.lineWidth = 3;
                context.font = "80px belwe";
                context.fillText(minionCard.manaCost, 95, 80);
                context.strokeText(minionCard.manaCost, 95, 80);

                context.font = "70px belwe";
                drawScaledImage(context, attack, 0.3, -150, 230);
                context.fillText(minionCard.attack, 92, 510);
                context.strokeText(minionCard.attack, 92, 510);

                drawScaledImage(context, health, 0.3, 150, 228);
                context.fillText(minionCard.health, 388, 510);
                context.strokeText(minionCard.health, 388, 510);

                callback(canvas);
            });
        });
    }

    function getHero(hero, callback) {
        assetLoader.loadImages(["image/hero/jaina.png", "image/HeroFrame.png", "image/card/attack.png", "image/card/health.png"], function (portrait, frame, attack, health) {
            var canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 550;
            var context = canvas.getContext("2d");

            if (portrait) {
                context.save();
                context.beginPath();
                context.moveTo(290, 60);
                context.lineTo(410, 160);
                context.lineTo(430, 460);
                context.lineTo(80, 460);
                context.lineTo(100, 160);
                context.lineTo(230, 60);
                context.closePath();
                context.clip();

                drawScaledImage(context, portrait, 0.75, 0, 0);

                context.restore();
            }

            context.drawImage(frame, 0, 0, 512, 512);

            context.font = "70px belwe";
            context.lineWidth = 2;

            if (hero.attack) {
                drawScaledImage(context, attack, 0.3, -150, 230);
                context.fillText(hero.attack, 92, 510);
                context.strokeText(hero.attack, 92, 510);
            }

            drawScaledImage(context, health, 0.4, 175, 200);

            if (hero.health === hero.maxHealth) {
                context.fillStyle = "white";
            } else {
                context.fillStyle = "red";
            }
            context.fillText(hero.health, 390, 485);
            context.strokeText(hero.health, 390, 485);

            callback(canvas);
        });
    }

    function getManaStone(text, callback) {
        assetLoader.loadImages(["image/mana.png"], function (mana) {
            var canvas = document.createElement("canvas");
            canvas.width = 120;
            canvas.height = 120;
            var context = canvas.getContext("2d");

            drawScaledImage(context, mana, 1, 0, 0);

            var fontSize = 30;

            context.font = fontSize + "px belwe";

            while (context.measureText(text).width < 60) {
                fontSize += 2;
                context.font = fontSize + "px belwe";
            }

            context.fillStyle = "white";
            context.lineWidth = 2;

            var size = context.measureText(text);
            context.fillText(text, 50 - size.width / 2, 50 + fontSize / 4);
            context.strokeText(text, 50 - size.width / 2, 50 + fontSize / 4);
            callback(canvas);
        });
    }

    function getSpellCard(spellCard, callback) {

        assetLoader.loadImages([getPortraitUrl(spellCard), "image/card/Card_Frame.png", "image/mana.png", "image/card/attack.png", "image/card/health.png"], function (portrait, frame, mana, attack, health) {
            var descriptionImageWidth = 250;
            var descriptionImageHeight = 130;
            var descriptionImageFontSize = 28;

            convertHtmlToImage(spellCard.description, descriptionImageWidth, descriptionImageHeight, descriptionImageFontSize, function (descriptionImage) {
                var canvas = document.createElement("canvas");
                canvas.width = 512;
                canvas.height = 550;
                var context = canvas.getContext("2d");

                if (portrait) {
                    context.save();
                    context.beginPath();
                    context.ellipse(260, 240, 160, 220, 0, 0, Math.PI*2);
                    context.clip();

                    drawScaledImage(context, portrait, 0.6, 0, -115);
                    context.restore();
                }

                context.drawImage(frame, 0, 0, 512, 512);

                context.drawImage(descriptionImage, 130, 340, descriptionImageWidth, descriptionImageHeight);

                context.font = "80px belwe";
                context.fillStyle = "white";

                drawScaledImage(context, mana, 1, 65, 10);
                context.fillText(spellCard.manaCost, 93, 80);

                callback(canvas);
            });
        });
    }

    function convertHtmlToImage(html, width, height, fontSize, callback) {
        var data =  "<svg xmlns='http://www.w3.org/2000/svg' width='" + width + "' height='" + height + "'>" +
                    "<foreignObject width='100%' height='100%'>" +
                    "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:" + fontSize + "px; text-align: center;'>" +
                        html +
                    "</div>" +
                    "</foreignObject>" +
                    "</svg>";



        var img = new Image();
        var url = "data:image/svg+xml," + data;
        img.src = url;

        img.onload = function () {
            callback(img);
        }
    }

    return {
        getMinionInPlay: getMinionInPlay,
        getMinionCard: getMinionCard,
        getSpellCard: getSpellCard,
        getHero: getHero,
        getManaStone: getManaStone
    };
};
