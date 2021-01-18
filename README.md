# Emerald Immersion - Join Site
This is the join splash site for EDIM.

## Prerequisites
 - NodeJS and NPM
 - Git or Github Desktop
 - VSCode (Recommended)

## Build
To build with `vscode` press `Ctrl + Shift + B` or otherwise run `npm run-script build` in a console.

This downloads dependencies with `npm install` and executes the build script which creates the `src/modules` folder.

## Debug
To debug you can use `vscode` and press `F5`, otherwise run `src/index.html` in your browser.

With VSCode it will open a debug instance of Chrome with working breakpoints.

## Release
After commiting changes, to release to github pages run `npm run-script publish`.

This will replace the contents of the `gh-pages` branch with the `src` folder.

There is a short delay (around 2 minutes) for the changes to appear on the website.

## Settings (and quick edits)
To easily edit settings/files you can log into GitHub and do it from the web interface.

First do changes in the `master` branch, like to `src/config.js`.

Then after that switch to the `gh-pages` branch and make the same edits.

It's not as neat as doing it using the `Release` as it involves doing things twice, but it will get your edits live quickly.
