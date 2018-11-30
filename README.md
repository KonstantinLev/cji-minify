# cji-minify
Css, Js and image compressor with gulp. Additionally supports deploy files on server.

Installing
------------
1 Copy `package.json` and `gulpfile.js` in your project.

2 Run
```
npm install
```

Configuration
-----
You must configure the paths to the appropriate directories:
- `pathToJsFiles` - path to js files of various libraries;
- `pathToCssFolder` -  path to css folder;
- `pathToMainFolder` -  path to base folder;
- `pathToJsFolder` -  path to compile js folder (default: `js`);
- `pathToFontsFolder` -  path to fonts.

How to use
-----
There are several tasks:
```
gulp build
```
This task will compress the js, css files, compress the images and copy everything into the new src directory.
```
gulp deploy
```
It transfers the src directory to the server. Required to specify the host name, username and password.