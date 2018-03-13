#!/usr/bin/env node

/**
 * @fileoverview Main CLI that is run via the avt command.
 * @author Grant Burnes
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path            = require('path');
const report          = require('../utils/reporter');
const createCli       = require('../lib/cli.js');
global.Proimise       = require('bluebird');
const updateNotifier  = require('update-notifier');
const pathTools       = require('../utils/path-tools');
const cliRoot         = pathTools.getBaseDir(require.main.filename);
const pkg             = require(path.resolve(path.dirname(cliRoot), '../../../../package.json'));

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

const version = process.version;
const majorVersion = Number(version.match(/\d+/)[0]);

updateNotifier({pkg}).notify();

if(majorVersion < 4) {
  report.panic(
    `AVT 1.0+ requires Node.js v4 or higher (you have ${version}).\n` +
    `Upgrade Node to the latest stable release.`
  );
}

process.on('unhandledRejection', error => {
  // This will exist the process in newer Node.js anyway so let's be consistent
  // across versions and crash.
  report.panic('UNHANDLED Rejection', error)
});

process.on('uncaughtException', error => {
  report.panic('UNHANDLED EXCEPTION', error);
});

const cli = createCli(process.argv);

if(cli.args.length === 0) {
  cli.help();
}
