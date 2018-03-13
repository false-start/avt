/**
 * @fileoverview Error Formatter for the Reporter.
 * @author Grant Burnes
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const PrettyError       = require('pretty-error');

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Returns a customized error formatter.
 * @returns {PrettyError}
 */
function getErrorFormatter() {
  const prettyError = new PrettyError();
  const base        = prettyError.render;

  prettyError.skipNodeFiles();

  prettyError.skip((traceLine, ln) => {
    return traceLine && traceLine.file === 'asyncToGenerator.js';
  });

  prettyError.appendStyle({
    'pretty-error': {
      marginTop: 1
    }
  });

  prettyError.render = err => {
    let rendered = base.call(prettyError, err);
    if(err && err.codeFrame) rendered = `\n${err.codeFrame}\n${rendered}`;
    return rendered;
  };

  return prettyError;
}

module.exports = getErrorFormatter;
