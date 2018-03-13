/**
 * @fileoverview Error Formatter for the Reporter.
 * @author Grant Burnes
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { createReporter }      = require('yurnalist');
const getErrorFormatter       = require('./error-formatter');
const VERBOSE = process.env.AVT_LOG_LEVEL === 'verbose';
const reporter = createReporter({ emoji: true, verbose: VERBOSE});
const errorFormatter = getErrorFormatter();
const base = Object.getPrototypeOf(reporter);
//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = Object.assign(reporter, {
  /**
   * Sets reporter in verbose mode
   * @param {boolean} isVerbose Sets the verbose mode.
   * @returns {void}
   */
  setVerbose(isVerbose = true) {
    this.isVerbose = isVerbose;
  },
  /**
   * Removes the color from the console log.
   * @param {boolean} isNoColor
   * @returns {void}
   */
  setNoColor(isNoColor = false) {
    if(isNoColor) {
      errorFormatter.withoutColors();
    }
  },

  /**
   * Calls the error function and exits the process.
   * @param {...*} args The arguments that need to passed to Error
   * @param {string} args.message The error message
   * @param {Object} [args.error] The Error Object if one is available.
   * @returns {void}
   */
  panic(...args) {
    this.error(...args);
    process.exit(1);
  },
  /**
   * Displays an error and logs the Error Object if one is provided.
   * @param {string} message The error message
   * @param {Object} [error] The error object if one is available.
   * @returns {void}
   */
  error(message, error) {
    if(arguments.length === 1 && typeof message !== 'string') {
      error = message;
      message = error.message;
    }

    base.error.call(this, message);
    if(error) console.log(errorFormatter.render(error))
  },
  /**
   * Reports the uptime
   * @param prefix The prefix
   */
  uptime(prefix) {
    this.verbose(`${prefix}: ${(process.uptime() * 1000).toFixed(3)} ms`);
  },
  /**
   * Simple activity timer that returns start and stop functions
   * @param {string} name The name of the activity
   * @returns {{start: function(), end: function()}}
   */
  activityTimer(name) {
    const spinner = reporter.activity();
    const start = process.hrtime();

    const elapsedTime = () => {
      const elapsed = process.hrtime(start);
      return `${convertHrtime(elapsed)['seconds'].toFixed(3)} s`
    };

    return {
      start: () => {
        spinner.tick(name)
      },
      end: () => {
        this.reporter.success(`${name} - ${elapsedTime()}`);
        spinner.end();
      }
    }
  }
});
