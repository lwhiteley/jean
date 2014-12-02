JEAN.JS (JWT Express API using Nodejs)
=========

[![Circle CI](https://circleci.com/gh/lwhiteley/jean.svg?style=svg)](https://circleci.com/gh/lwhiteley/jean)

This is a Nodejs API template modelled from the meanjs full stack.

This is a backend only template with the use of JWT as the authentication option


## Prerequisites
Make sure you have installed all these prerequisites on your development machine.
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager, if you encounter any problems, you can also use this [Github Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process, in order to install it make sure you've installed Node.js and npm, then install grunt globally using npm:

```bash
$ sudo npm install -g grunt-cli
```
## Downloading JEAN.JS
There are several ways you can get the JEAN.JS boilerplate:

### Cloning The GitHub Repository
You can also use Git to directly clone the JEAN.JS repository:
```bash
$ git clone https://github.com/medullan/jean.git meanjs
```
This will clone the latest version of the JEAN.JS repository to a **jean** folder.

### Downloading The Repository Zip File
Another way to use the MEAN.JS boilerplate is to download a zip copy from the [master branch on github](https://github.com/medullan/jean/archive/master.zip). You can also do this using `wget` command:
```bash
$ wget https://github.com/medullan/jean/archive/master.zip -O jean.zip; unzip jean.zip; rm jean.zip
```
Don't forget to rename **jean-master** after your project name.

## Quick Install
Once you've downloaded the boilerplate and installed all the prerequisites, you're just a few steps away from starting to develop you JEAN application.

The first thing you should do is install the Node.js dependencies. The boilerplate comes pre-bundled with a package.json file that contains the list of modules you need to start your application, to learn more about the modules installed visit the NPM & Package.json section.

To install Node.js dependencies you're going to use npm again, in the application folder run this in the command-line:

```bash
$ npm install
```

## Running Your Application
After the install process is over, you'll be able to run your application using Grunt, just run grunt default task:

```bash
$ grunt
```

Your application should run on the 3000 port so in your browser just go to [http://localhost:3000](http://localhost:3000)

That's it! your application should be running by now.

============
