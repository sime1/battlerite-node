const champions = require('./champions');
const maps = require('./maps');
let OPTIONS = require('./common/options.js');
const Match = require('./match');
const Player = require('./player');
const Team = require('./team');

/**
* Options used to configure the Battlerite module.
* @typedef {Object} BattleriteConfig
* @property {String} key - Your API key. you can get one at the [developer portal]{@link https://developer.battlerite.com/}
*/

/**
* Root module of battlerite-node.
* @namespace
*/
const Battlerite = {
  Match,
  Player,
  Team,
  /**
   * function used to cofigure the Battlerite module.
   * @param {BattleriteConfig} options - configuration object
   */
  config: (options) => {
    OPTIONS.headers.Authorization = `Bearer ${options.key}`;
  },
  champions,
  maps
}

module.exports = Battlerite;
