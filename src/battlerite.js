const URL = 'https://api.dc01.gamelockerapp.com/shards/global/';
const httpsExecutor = require('./https-executor');
const champions = require('./champions');
const maps = require('./maps');

let OPTIONS = {
  host: 'api.dc01.gamelockerapp.com',
  path: '/shards/global',
  headers: {
    'Accept': 'application/vnd.api+json'
  }
};

/**
* Class Match, contains data about a Battlerite match and provides static methods to
* retrive data from the API. To make the use of the class easier, the data received from the API is reorganized so that relationships are
* resolved automatically. This means that there is no need to find the id of a round
* inside the match data and then search inside the included data for a round with the same ID.
* This also means that the class is exactly like the one in the [official documentation]{@link http://battlerite-docs.readthedocs.io/en/latest/match_data_summary/match_data_summary.html#match-object}
* Below are reported the properties of the class. These are just for convenience.
* If the official API gets updated, the properties of the class may change, so to be sure
* you should refer to the [official documentation]{@link http://battlerite-docs.readthedocs.io/en/latest/match_data_summary/match_data_summary.html#match-object}
* @property {String} type - always "match"
* @property {String} id - Match ID
* @property {String} creatredAt - Time of Match Played, in [iso8601 format]{@link https://en.wikipedia.org/wiki/ISO_8601}
* @property {Number} duration - integer representing the duration of the match
* @property {String} gameMode -  Game Mode
* @property {String} patchVersion - Version of the gamethe match was played in
* @property {String} shardID - Region shard
* @property {map} Stats - stats particular to the match (right now it only contains a mapID, which probably tells you wich map the game was played in. more insigthful stats can be found inside the roster, round and participant objects)
* @property {Array} assets - Telemetry data. array of [Match.assets objects]{@link http://battlerite-docs.readthedocs.io/en/latest/match_data_summary/match_data_summary.html#match-object}
* @property {Array} rosters - array of [rosters objects]{@link http://battlerite-docs.readthedocs.io/en/latest/match_data_summary/match_data_summary.html#rosters-object}
* @property {Array} rounds - array of [rounds objects]{@link http://battlerite-docs.readthedocs.io/en/latest/match_data_summary/match_data_summary.html#rounds-object}
* @property {Array} spectators - Participants that are spectating
* @property {String} titleId - identifies the studio and game
* @property {Object} _included - contains the raw included data returned by the API.
* @memberof Battlerite
*/
class Match{
  /**
   * Constructor for the Match class.
   * @param {Object} matchData - data about the match
   * @param {boolean} resolve - tells the constructor whether it has to resolve matchData relationships or not.
   * if false, matchData is just copied inside the new match. If true, data is organized so that
   * relationships are resolved before returning the match. In order to resolve relationships after
   * object construction, you have to create a new match. Example:
   * <pre><blockquote><code>
   * rawMatch = new Match(data, false); //relationship are not resolved
   * resolvedMatch = new Match(rawMatch, true); //resolvedMatch now contains a match with resolved relationships. rawMatch has not been modified
   * </code></blockquote></pre>
   *
   * this allows to copy data between two different Match objects.
   * @param {bool} include - tells the constructor whether it has to save the included data returned by the api or not. If true, the
   * _included property of the object contains that data, else _included is undefined.
   */
  constructor(matchData, resolve = true, include = false){
    if(!resolve)
      Object.assign(this, matchData);
    else{
      let data = matchData.data;
      if(include)
        this._included = matchData.included;
      Object.assign(this, resolveRelationships(data, matchData.included));
    }
  }
  /**
  * Pagination options
  * @typedef {Object} PageOptions
  * @property {number} offset - the match offset to start from. Alolws paging over results.
  * @property {number} limit - limits the number of matches retureved. The default (and current maximum) is 5. Values less than 5 and greater than 1 are supported.
  */

  /**
  * Match Filter options
  * @typedef {Object} MatchFilterOptions
  * @property {String} createdAt-start - start time of the matches retrieved. format is iso8601.
  * @property {String} createdAt-end - end time of the matches retrieved. format is iso8601.
  * @property {String|String[]} playerIds - Filters by player ID. Can be a string of comma-separated IDs or an array of IDs.
  */

  /**
  * Options available while retrieving a list of matches.
  * @typedef {Object} MatchListOptions
  * @property {PageOptions} page - pagination options
  * @property {String} sort="createdAt" - tells how matches should be sorted.
  * @property {MatchFilterOptions} filter - Filter options.
  */

  /**
   * Static method that fetches a list of matches from the API. You must call {@link Battlerite.config} and set the API key before calling this.
   * @param {MatchListOptions} params - Options used to select which matches are retrieved.
   * @returns {Promise} a promise which in case of success is fulfilled with an array of {@link Battlerite.Match} objects
  */
  static getList(params = {}){
    let options = {...OPTIONS}, urlParams = [];
    options.path += '/matches';
    let page = {}, sort, filter = {};
    // params filter
    ({
      page: {
        offset: page['offset'],
        limit: page['limit']
      } = {},
      sort,
      filter: {
        'createdAt-start': filter['createdAt-start'],
        'createdAt-end': filter['createdAt-end'],
        playerIds: filter['playerIds']
      } = {}
    } = params);
    // url creation
    for(let prop in page){
      if(page[prop])
        urlParams.push('page[' + prop + ']=' + page[prop]);
    }
    if(sort){
      urlParams.push('sort=' + sort);
    }
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
    if(urlParams.length)
      options.path += '?' + urlParams.join('&');
    let promise = new Promise(httpsExecutor(options));
    return promise.then((res) => res.data.map((match) => new Match({data: match, included: res.included})));
  }
  /**
   * static method that fetches the data about a single match. You must call {@link Battlerite.config} and set the API key before calling this.
   * @param {String} id - id of the match to retrieve.
   * @returns {Promise} a promise which in case of success is fulfilled with a {@link Battlerite.Match} Object.
  */
  static get(id){
    if(!id)
      return Promise.reject(new Error('Error, match ID is required'));
    let options = {...OPTIONS};
    options.path += `/matches/${id}`;
    return (new Promise(httpsExecutor(options))).then((data) => new Match(data, true));
  }

  /**
   * As retrieving telemetry data is expensive in terms of resources, it isn't fetched automatically. Instead,
   * {@link Match} Objects provide a getTelemetry method that let you retrieve telemetry data when you need it.
   * @return {Promise} a promise which in case of success is fulfilled with an array containing the data retrieved from the telemetry url.
   * in case more than one asset is present in the {@link Battlerite.Match} object, data from all the assets is downloaded and then
   * merged into a single array, which is then used to fulfill the promise.
   */
  getTelemetry(){
    let urls = this.assets.filter( (asset) => {
      return (asset.name === 'telemetry' && asset.URL);
    }).map((asset) => {
      return asset.URL;
    });
    let promises = urls.map((url) => {
      return new Promise(httpsExecutor(url));
    })
    return Promise.all(promises).then((assets) => {
      return assets.reduce((acc, asset) => {
        return acc.concat(asset);
      }, []);
    });
  }
}
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
class Player{

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
    if(!reorganize)
      Object.assign(this, playerData);
    else{
      let data = playerData.data;
      Object.assign(this, resolveRelationships(data, null));
    }
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

/**
* Class Team, containing data about a single team and static methods used to
* retrieve team data from the API.
* @property {String} type - alway "team"
* @property {String} id - team unique ID
* @property {String} name - team name
* @property {String} titleId - "stunlock-studios-battlerite"
* @property {String} shardId - id of the shard where the team data resides. As all the data is stored in the same datacenter right now, this always equals "global"
* @property {Objct} stats -
* @memberof Battlerite
*/
class Team {

  /**
  * Team Tag options - required parameters for retrieving a list of teams
  * @typedef {Object} TeamTagOptions
  * @property {String|String[]} playerIds - The identifiers of the team's players. Can be a string of comma-separated IDs or an array of IDs.
  * @property {number} season - the number of the season the team played.
  */

  /**
   * Options available while retrieving a list of teams.
   * @typedef {Object} TeamListOptions
   * @property {TeamTagOptions} filter - required tag options.
   */

  /**
   * Constructor for the Team class.
   * @param {Object} teamData - data about the team
   * @param {boolean} reorganize - tells the constructor whether it has to reorganize the team data or not.
   * if false, teamData is just copied inside the new team. If true, data is organized so that
   * attributes are moved directly inside the Team Object.
   * this allows to copy data between two different Team objects.
   */
  constructor(teamData, reorganize = true){
    if(!reorganize)
      Object.assign(this, teamData);
    else{
      let data = teamData.data;
      Object.assign(this, resolveRelationships(data, null));
    }
  }
  /**
   * static method that fetches the data about a single team. You must call {@link Battlerite.config} and set the API key before calling this.
   * NOTE: At the moment the api does not provide a way to retrieve data about a single team,
   * so the method returns a promise that is always rejected.
   * @param {String} id - id of the team to retrieve.
   * @returns {Promise} a promise which in case of success is fulfilled with a {@link Battlerite.Team} Object.
  */
  static get(id){
    if(!id)
      return Promise.reject(new Error('Must specify id'));
    let options = {...OPTIONS};
    options.path += `/teams/${id}`;
    return new Promise(httpsExecutor(options)).then((data) => new Team(data, true));
  }
  /**
   * Static method that fetches a list of teams from the API. You must call {@link Battlerite.config} and set the API key before calling this.
   * @param {TeamListOptions} params - Options used to select which teams are retrieved.
   * @returns {Promise} a promise which in case of success is fulfilled with an array of {@link Battlerite.Team} objects
  */
  static getList(params = {}){
    let options = {...OPTIONS}, urlParams = [];
    options.path += '/teams';
    let tag = {};
    ({
      tag: {
        playerIds: tag['playerIds'],
        season: tag['season']
      } = {}
    } = params);
    for(let prop in tag){
      if(tag[prop]){
        let curTag;
        if(Array.isArray(tag[prop]))
          curTag = tag[prop].join(',');
        else
          curTag = tag[prop];
        urlParams.push('tag[' + prop + ']=' + curTag);
      }
    }
    if(urlParams.length){
      options.path += `?${urlParams.join('&')}`;
    }
    return new Promise(httpsExecutor(options)).then((res) => res.data.map((team) => new Team({data: team, included: res.included})));
  }
}

function resolveRelationships(obj, included){
  if(!obj)
    return;
  let resolved = {...obj, ...obj.attributes};
  delete resolved.attributes;
  let toResolve = [resolved];
  while(toResolve.length){
    let cur = toResolve[0];
    for(let type in cur.relationships){
      cur[type] = [];
      rel = cur.relationships[type];
      toResolve.push(rel);
      let relData = (!Array.isArray(rel.data) && rel.data) ? [rel.data] : rel.data;
      for(let i in relData){
        let id = relData[i].id;
        let el;
        if(included)
          el = included.find((el) => el.id === id);
        if(el){
          let newRel = JSON.parse(JSON.stringify(el));
          if(newRel.attributes){
            Object.assign(newRel, newRel.attributes);
            delete newRel.attributes;
          }
          cur[type].push(newRel);
          toResolve.push(newRel);
        }
      }
    }
    delete cur.relationships;
    toResolve.splice(0,1);  //remove the first element, as we just resolved relationships
  }
  return resolved;
}

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
