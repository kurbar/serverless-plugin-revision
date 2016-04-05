'use strict';

/**
 * Serverless Revisioning Plugin
 * Karl Viiburg <karl@viiburg.ee> 2016
 */

module.exports = function(ServerlessPlugin, serverlessPath) { // Always pass in the ServerlessPlugin Class

  const _       = require('lodash'),
      path      = require('path'),
      appPath   = require('app-root-path'),
      pJson     = require(appPath + '/package.json'),
      fs        = require('fs'),
      git       = require('git-rev'),
      SCli      = require(path.join(serverlessPath, 'utils/cli')),
      BbPromise = require('bluebird'); // Serverless uses Bluebird Promises and we recommend you do to because they provide more than your average Promise :)

  /**
   * ServerlessPluginRevision
   */

  class ServerlessPluginRevision extends ServerlessPlugin {

    /**
     * Constructor
     * - Keep this and don't touch it unless you know what you're doing.
     */

    constructor(S) {
      super(S);
    }

    /**
     * Define your plugins name
     * - We recommend adding prefixing your personal domain to the name so people know the plugin author
     */

    static getName() {
      return 'ee.viiburg.' + ServerlessPluginRevision.name;
    }

    registerHooks() {
      SCli.log("Registering hooks");

      this.S.addHook(this._addRevisionHeader.bind(this), {
        action: 'endpointBuildApiGateway',
        event:  'pre'
      });

      return BbPromise.resolve();
    }

    getPackageJsonVersion() {
      SCli.log("_getPackageJsonVersion");
      return pJson.version;
    }

    _addRevisionHeader(evt) {
      SCli.log("_addRevisionHeader");

      var packageJsonVersion = this.getPackageJsonVersion(),
          endpoint = this.S.state.getEndpoints({paths: [evt.options.path]})[0],
          populatedEndpoint = endpoint.getPopulated({
            stage: evt.options.stage,
            region: evt.options.region
          });

      return new Promise(function (resolve, reject) {
        git.short(function (lastCommitHash) {
          _.each(populatedEndpoint.responses, function (response) {
            if (!response.responseParameters) {
              response.responseParameters = {};
            }

            SCli.log(lastCommitHash);
            response.responseParameters['method.response.header.API-Revision'] = '\'' + packageJsonVersion + '-' + lastCommitHash + '\'';
          });

          endpoint.set(populatedEndpoint);

          resolve();
        });
      }).then(function() {
        return Promise.resolve(evt);
      });
    }
  }

  // Export Plugin Class
  return ServerlessPluginRevision;

};