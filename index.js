'use strict';

/**
 * Serverless Revisioning Plugin
 * Karl Viiburg <karl@viiburg.ee> 2016
 */

module.exports = function(S) { // Always pass in the ServerlessPlugin Class

  const _       = require('lodash'),
      path      = require('path'),
      appPath   = require('app-root-path'),
      pJson     = require(appPath + '/package.json'),
      fs        = require('fs'),
      git       = require('git-rev'),
      Promise = require('bluebird'); // Serverless uses Bluebird Promises and we recommend you do to because they provide more than your average Promise :)

  /**
   * ServerlessPluginRevision
   */

  class ServerlessPluginRevision extends S.classes.Plugin {

    /**
     * Constructor
     * - Keep this and don't touch it unless you know what you're doing.
     */

    constructor() {
      super();
    }

    /**
     * Define your plugins name
     * - We recommend adding prefixing your personal domain to the name so people know the plugin author
     */

    static getName() {
      return 'ee.viiburg.' + ServerlessPluginRevision.name;
    }

    registerHooks() {
      S.addHook(this._addRevisionHeader.bind(this), {
        action: 'endpointBuildApiGateway',
        event:  'pre'
      });

      return Promise.resolve();
    }

    getPackageJsonVersion() {
      return pJson.version;
    }

    _addRevisionHeader(evt) {
      var packageJsonVersion = this.getPackageJsonVersion(),
          endpoint = S.getProject().getEndpoint(evt.options.name),
          populatedEndpoint = endpoint.toObjectPopulated({
            stage: evt.options.stage,
            region: evt.options.region
          });

      return new Promise(function (resolve, reject) {
        git.short(function (lastCommitHash) {
          _.each(populatedEndpoint.responses, function (response) {
            if (!response.responseParameters) {
              response.responseParameters = {};
            }

            response.responseParameters['method.response.header.API-Revision'] = '\'' + packageJsonVersion + '-' + lastCommitHash + '\'';
          });

          endpoint.fromObject(populatedEndpoint);

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