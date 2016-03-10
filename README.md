# client

The web client of the game.

## Installation

Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already. Run the following command in the root of the repo:

```sh
npm install
```

## Running the Client

Make sure that the installation step is done. Then run `npm run watch` in the root of the repo, in order to build the project files. This command will continue to watch files for changes to rebuild the project, so don't wait for the command to finish. Now you can open the `src/index.html` file in your browser and play the game!


## Dependencies

- [core](https://github.com/git+https:/): Core functionality shared between client and server. Basically all the logic.

## Dev Dependencies

- [assemble-less](https://github.com/assemble/assemble-less): Compile LESS to CSS. Adds experimental features that extend Less.js for maintaining UI components, &#39;bundles&#39; and themes. From Jon Schlinkert, core team member of Less.js. This project is a fork of the popular grunt-contrib-less plugin by the talented Tyler Kellen. Please use that plugin if you require something stable and dependable.
- [browserify](https://github.com/substack/node-browserify): browser-side require() the node way
- [grunt](https://github.com/gruntjs/grunt): The JavaScript Task Runner
- [grunt-browserify](https://github.com/jmreidy/grunt-browserify): Grunt task for node-browserify
- [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch): Run predefined tasks whenever watched file patterns are added, changed or deleted.
- [load-grunt-tasks](https://github.com/git+https:/): Load multiple grunt tasks using globbing patterns

## Other

- [Trello](https://trello.com/b/o7O6oTkx/achtungonline): Flexible online organization of workflow
