export default function AssetLoader(options) {
    const assetBaseUrl = options.assetBaseUrl || "/";

    const assetCache = {};

    function loadImages(assetUrls, callback) {
        function loadImage(url, callback) {
            const image = new Image();
            image.onload = function () {
                callback(image);
            };
            image.onerror = function () {
                console.error("Failed to load asset: " + url);
                callback();
            };
            image.src = url;
        }

        loadAssets(assetUrls, loadImage, callback);
    }

    function loadAudio(assetUrls, callback) {
        function loadAudio(url, callback) {
            const audio = new Audio();
            audio.addEventListener("canplaythrough", function() {
                callback(audio);
            }, false);
            audio.src = url;
            audio.load();
        }

        loadAssets(assetUrls, loadAudio, callback);
    }

/*    function loadAnyAudio(assetUrls, callback) {
        if (!Array.isArray(assetUrls)) {
            assetUrls = [assetUrls];
        }

        assetUrls = assetUrls.map(function (url) {
            return assetBaseUrl + url;
        });

        var cachedAssetUrl = assetUrls.find((assetUrl) => assetCache[assetUrl]);

        if (cachedAssetUrl) {
            return callback(assetCache[cachedAssetUrl]);
        }

        function loadAudio(url, callback) {
            const audio = new Audio();
            audio.addEventListener("canplaythrough", function() {
                callback(audio);
            }, false);
            audio.src = url;
            audio.load();
        }

        loadAnyAsset(assetUrls, loadAudio, callback);




        function getAudioAsset(urls, callback) {
            const url = urls[0];
            if (url) {
                const audio = new Audio(url);
                audio.addEventListener("canplaythrough", function () {
                    console.log("Can play through");
                    assetCache[url] = audio;
                    callback(audio);
                }, false);
                audio.addEventListener("error", function () {
                    console.log("Will try with a different url from ", urls.splice(1));
                    getAudioAsset(urls.splice(1), callback);
                }, false);
                audio.load();
            } else {
                console.log("No asset could be found from", assetUrls);
            }
        }

    }*/

    function loadAssets(assetUrls, loadAsset, callback) {
        if (!Array.isArray(assetUrls)) {
            assetUrls = [assetUrls];
        }

        assetUrls = assetUrls.map(function (url) {
            return assetBaseUrl + url;
        });

        var async = false;
        const assets = {};
        var numLoaded = 0;

        function assetReady(asset, assetUrl) {
            assets[assetUrl] = asset;
            numLoaded++;
            if (numLoaded === assetUrls.length) {
                const args = [];
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
        //loadAnyAudio: loadAnyAudio,
        loadAudio: loadAudio,
        loadImages: loadImages
    };
};
