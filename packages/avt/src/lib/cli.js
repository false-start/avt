/**
 * @fileoverview Main CLI Object.
 * @author Grant Burnes
 */

/*
 * The CLI object should *not* call process.exit() directly. It should only return
 *  exit codes. This allows other programs to use the CLI object and still control
 * when the program exits.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const path        = require('path');
const cli         = require('commander');
const report      = require('../utils/reporter');
const pathTools   = require('../utils/path-tools');
const cliRoot     = pathTools.getBaseDir(require.main.filename);
const pkg         = require(path.resolve(path.dirname(cliRoot), '../../../../package.json'));
const boot        = require('../bootstrap');
const init        = require('./init');
const merge       = require('lodash/merge');

//------------------------------------------------------------------------------
// Public API
//------------------------------------------------------------------------------

function createCli(args) {
  cli
    .version(pkg.version);

  cli
    .command('init')
    .description('Inititalize AVT and verify config')
    .action(function() {
      init(pkg, cliRoot, report);
    });

  cli
    .command('generate')
    .description('Generate a new application version.')
    .option('-d, --dry-run', 'Run AVT is dry run mode.')
    .option('-v, --verbose', 'Turns on debug mode')
    .option('-p, --publish', 'Run AVT in Publish Mode')
    .option('-n, --no-color', 'Turns off color output in console.')
    .option('-D, --disable-ci-verify', 'Turns off CI verification')
    .action(function(branch, ops) {
      const defaults = {
        noCiVerify: false,
        publishMode: false,
        dryRun: false
      };
      report.setVerbose(!!ops.verbose);
      report.setNoColor(!!ops['no-color']);
      ops.noCiVerify = !!ops['disable-ci-verify'];
      ops.publishMode = !!ops.publish;
      ops.dryRun = !!ops['dry-run'];
      const options = merge(defaults, ops);

      boot(branch, options, root, report)
    });

  return cli.parse(args);
}

module.exports = createCli;
