const Wrapper = require('./common/wrapper');
const httpsExecutor = require('./common/https-executor');
let OPTIONS = require('./common/options.js');

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
class Team extends Wrapper {

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
    super(teamData, reorganize);
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

module.exports = Team;
