export default function AssetLoader(options) {
    var assetBaseUrl = options.assetBaseUrl || "/";

    var assetCache = {};

    function loadImages(assetUrls, callback) {
        function loadImage(url, callback) {
            var image = new Image();
            image.onload = function () {
                callback(image);
            };
            image.onerror = function () {
                console.error("Failed to load asset: " + url);
                callback();
            }
            image.src = url;
        }

        loadAssets(assetUrls, loadImage, callback);
    }

    function loadAudio(assetUrls, callback) {
        function loadAudio(url, callback) {
            var audio = new Audio();
            audio.addEventListener("canplaythrough", function() {
                callback(audio);
            }, false);
            audio.src = url;
            audio.load();
        }

        loadAssets(assetUrls, loadAudio, callback);
    }

    function loadAssets(assetUrls, loadAsset, callback) {
        if (!assetUrls.forEach) {
            assetUrls = [assetUrls];
        }

        assetUrls = assetUrls.map(function (url) {
            return assetBaseUrl + url;
        });

        var async = false;
        var assets = {};
        var numLoaded = 0;

        function assetReady(asset, assetUrl) {
            assets[assetUrl] = asset;
            numLoaded++;
            if (numLoaded === assetUrls.length) {
                var args = [];
                assetUrls.forEach(function (url) {
                    args.push(assets[url]);
                });

                if (!async) {
                    setTimeout(function () {
                        callback.apply(null, args);
                    }, 0);
                } else {
                    callback.apply(null, args);
                }
            }
        }

        assetUrls.forEach(function load(assetUrl) {
            if (assetCache[assetUrl]) {
                assetReady(assetCache[assetUrl], assetUrl);
            } else {
                async = true;
                loadAsset(assetUrl, function (asset) {
                    assetReady(asset, assetUrl);
                    assetCache[assetUrl] = asset;
                }, function () {
                    console.error("Failed to load " + assetUrl);
                    assetReady(false, assetUrl);
                });
            }
        });
    }

    return {
        loadImages: loadImages,
        loadAudio: loadAudio
    };
};
