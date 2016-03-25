# client

The web client of the game.

## Installation
1. Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.
2. Run `npm install` command in the root of the repo.

## Running the Client
1. Make sure that the installation step is done.
2. Make sure a game server needs to be running on port `8001`, see [firestone-clojure](http://github.com/tomas81508/firestone-clojure).
3. Run `npm run serve` in the root of the repo, in order to start the web server. This command will continue to watch files for changes to rebuild the project, so don't wait for the command to finish.
4. Then visit [http://localhost:8000](http://localhost:8000) to see the actual game.
5. Play away.

## Developing
1. Make sure a game server is running on port `8001`.
2. Run `npm run serve` to serve the client files. This is an ongoing process.
3. In another terminal, run `npm run watch` so that the client code gets compiled when you make changes. This too is an ongoing process.
4. Code away.
