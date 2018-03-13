/**
 * @fileoverview Utility class for managing Paths.
 * @author Grant Burnes
 */


//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const inside = require('path-is-inside');
const path   = require('path');


//------------------------------------------------------------------------------
// Public API
//------------------------------------------------------------------------------

/**
 * Determines the base directory for node packages in the project directory.
 * This does not include node_modules in the path so it can be used for all
 * references relative to the filePath.
 * @param {string} filePath The file path
 * @returns {string} The base directory for the given file path.
 */
function getBaseDir(filePath) {
  const projectPath = path.resolve(require.main.filename, '../../../');

  if(filePath && inside(filePath, projectPath)) {
    // be careful of https://github.com/substack/node-resolve/issues/78
    return path.join(path.resolve(filePath));
  }

  return path.join(projectPath);
}

module.exports = {
  getBaseDir
};
