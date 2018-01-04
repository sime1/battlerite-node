const Wrapper = require('./common/wrapper');
const httpsExecutor = require('./common/https-executor');
let OPTIONS = require('./common/options.js');

/**
* Class Player, containing data about a single player and static methods used to
* retrieve Player data from the API.
* @property {String} type - alway "player"
* @property {String} id - player unique ID
* @property {String} name - player name
* @property {String} patchVersion - empty string
* @property {String} shardId - id of the shard where the player data resides. As all the data is stored in the same datacenter right now, this is always empty
* @property {Objct} stats -
* @memberof Battlerite
*/
class Player extends Wrapper {

  /**
  * Player Filter options
  * @typedef {Object} PlayerFilterOptions
  * @property {String|String[]} playerIds - Filters by player ID. Can be a string of comma-separated IDs or an array of IDs.
  * @property {String|String[]} playerNames - Filters by player name. Can be a string of comma-separated IDs or an array of names.
  * @property {String|String[]} steamIds - Filters by player steam ID. Can be a string of comma-separated IDs or an array of steam IDs.
  */

  /**
   * Options available while retrieving a list of players.
   * @typedef {Object} PlayerListOptions
   * @property {PlayerFilterOptions} filter - Filter options.
   */

  /**
   * Constructor for the Player class.
   * @param {Object} playerData - data about the player
   * @param {boolean} reorganize - tells the constructor whether it has to reorganize the player data or not.
   * if false, playerData is just copied inside the new player. If true, data is organized so that
   * attributes are moved directly inside the Player Object.
   * this allows to copy data between two different Player objects.
   */
  constructor(playerData, reorganize = true){
    super(playerData, reorganize);
  }

  /**
   * Static method that fetches a list of players from the API. You must call {@link Battlerite.config} and set the API key before calling this.
   * @param {PlayerListOptions} params - Options used to select which players are retrieved.
   * @returns {Promise} a promise which in case of success is fulfilled with an array of {@link Battlerite.Player} objects
  */
  static getList(params = {}){
    let options = {...OPTIONS}, urlParams = [];
    options.path += '/players';
    let filter = {};
    ({
      filter: {
        playerNames: filter['playerNames'],
        playerIds: filter['playerIds'],
        steamIds: filter['steamIds']
      } = {}
    } = params);
    for(let prop in filter){
      if(filter[prop]){
        let curFilter;
        if(Array.isArray(filter[prop]))
          curFilter = filter[prop].join(',');
        else
          curFilter = filter[prop];
        urlParams.push('filter[' + prop + ']=' + curFilter);
      }
    }
    if(urlParams.length){
      options.path += `?${urlParams.join('&')}`;
    }
    return new Promise(httpsExecutor(options)).then((res) => res.data.map((player) => new Player({data: player, included: res.included})));
  }
  /**
   * static method that fetches the data about a single player. You must call {@link Battlerite.config} and set the API key before calling this.
   * @param {String} id - id of the player to retrieve.
   * @returns {Promise} a promise which in case of success is fulfilled with a {@link Battlerite.Player} Object.
  */
  static get(id){
    if(!id)
      return Promise.reject(new Error('Must specify id'));
    let options = {...OPTIONS};
    options.path += `/players/${id}`;
    return new Promise(httpsExecutor(options)).then((data) => new Player(data, true));
  }
}

module.exports = Player;
