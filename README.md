# JJScript

> *Zip and destroy*

Scans recursively for all files inside a given folder with a specific extension, zips them, and deletes originals.

**NOTE**: This project is the NodeJS-based solution. For an executable standalone app that runs on Windows, Linux and macOS, try [JJpack](https://github.com/jagomf/jjpack).

## Install

1. Make sure you have [NodeJS](https://nodejs.org/) installed. If you don't, go get it.

2. Copy the whole folder of this project to the location you want to be processed, e.g., if you want `~/user/projects` to be processed copy this folder so that it is placed in `~/user/projects/jjscript`.

3. Open a console, go inside the `jjscript` folder, and enter:
```
npm install
```

## Configuration

By default, files with `dwg` extension are processed, and original files get deleted after processing.

This can be changed in `index.js` file in `SETUP` section at the top:
* `extension` holds the string for the file extension. **NOTE**: case is sensitive, meaning that `DWG` files will NOT be processed, only `dwg` files.
* `deleteAfter` can be set to `false` if original files are to be kept.

## Usage

To run, open a console, go inside the `jjscript` folder, and enter:
```
npm start
```

Results will be logged to the console.
