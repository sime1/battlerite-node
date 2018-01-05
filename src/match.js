const Wrapper = require('./common/wrapper');
const httpsExecutor = require('./common/https-executor');
let OPTIONS = require('./common/options.js');

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
* @property {map} stats - stats particular to the match (right now it only contains a mapID, which probably tells you wich map the game was played in. more insigthful stats can be found inside the roster, round and participant objects)
* @property {MatchTags} tags - Tags of the match, stating match and ranking types.
* @property {Array} assets - Telemetry data. array of [Match.assets objects]{@link http://battlerite-docs.readthedocs.io/en/latest/match_data_summary/match_data_summary.html#match-object}
* @property {Array} rosters - array of [rosters objects]{@link http://battlerite-docs.readthedocs.io/en/latest/match_data_summary/match_data_summary.html#rosters-object}
* @property {Array} rounds - array of [rounds objects]{@link http://battlerite-docs.readthedocs.io/en/latest/match_data_summary/match_data_summary.html#rounds-object}
* @property {Array} spectators - Participants that are spectating
* @property {String} titleId - identifies the studio and game
* @property {Object} _included - contains the raw included data returned by the API.
* @memberof Battlerite
*/
class Match extends Wrapper {
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
    super(matchData, resolve);
    if(include) {
      this._included = matchData.included;
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
  * @property {String|String[]} patchVersion - Filters by patch version. Can be a string of comma-separated versions or an array of versions.
  * @property {String|String[]} serverType - Filters by server type ("QUICK2V2", ...). Can be a string of comma separated values or an array.
  * @property {String} rankingType - Filters by ranking type ("RANKED", "UNRANKED").
  */

  /**
  * Options available while retrieving a list of matches.
  * @typedef {Object} MatchListOptions
  * @property {PageOptions} page - pagination options
  * @property {String} sort="createdAt" - tells how matches should be sorted.
  * @property {MatchFilterOptions} filter - Filter options.
  */

  /**
   * Tags available when retrieving a match
   * @typedef {Object} MatchTags
   * @property {String} rankingType - "RANKED" or "UNRANKED"
   * @property {String} serverType - "QUICK2V2", "QUICK3V3", ...
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
        playerIds: filter['playerIds'],
        patchVersion: filter['patchVersion'],
        serverType: filter['serverType'],
        rankingType: filter['rankingType']
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

module.exports = Match;
