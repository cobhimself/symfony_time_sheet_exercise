/*
 * Any javascript methods/properties needed among all javascript files
 * should be placed in this file as it is concatenated first.
 */

/**
 * PE
 *
 * Main namespace for the php exercise project.
 *
 * @namespace {Object} PE
 */

(function (PE, $, undefined) {
  'use strict';

  PE.namespace = function namespace(nsString) {
      var parts = nsString.split('.'),
          parent = PE,
          i;

      // strip redundant leading global
      if (parts[0] === "PE") {
          parts = parts.slice(1);
      }

      for (i = 0; i < parts.length; i += 1) {
          // create a property if it doesn't exist
          if (typeof parent[parts[i]] === "undefined") {
              parent[parts[i]] = {};
          }
          parent = parent[parts[i]];
      }

      return parent;
  };

  /**
   * PE.util
   *
   * This module contains methods that are useful to all other modules.
   *
   * @return {} Returns nothing.
   * @name PE.util
   * @namespace {Object} PE.util
   */
  PE.util = PE.namespace('util');

  /**
   * Cache class
   *
   * Stores key/value pairs intelligently.
   *
   * @class PE.util.Cache
   */
  PE.util.Cache = function Cache() {
    this._cache = {};
  };

  /**
   * Set a key/value pair in cache.
   *
   *
   * @param {string} key
   * @param {*} value
   *
   * @returns {PE.util.Cache}
   */
  PE.util.Cache.prototype.set = function setCache(key, value) {

    this._cache[key] = value;

    return this;
  };

  /**
   * Get a cache key value or, if no value exists at the given key, return
   * the default.
   *
   * @param {String} key A key to pull a value for.
   * @param {*} def The default value to return if key does not exist. If
   *                not provided, false is assumed.
   *
   * @return {Boolean} The value of the key within the cache.
   */
  PE.util.Cache.prototype.get = function getCache(key, def) {

    //If no default value is set, use false.
    def = def || false;

    return (this.isset(key)) ? this._cache[key] : def;
  };

  /**
   * Determine whether or not the given key exists within the cache.
   *
   * @param {String} key The key to check for existence of.
   *
   * @return {Boolean} True if the key exists, false otherwise.
   */
  PE.util.Cache.prototype.isset = function isset(key) {
    return (key in this._cache);
  };

}(window.PE = window.PE || {}, jQuery));
