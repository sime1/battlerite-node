/**
* Map ids
* @enum {String}
* @memberof Battlerite.maps
*/
const mapIds = {
  /** Sky Ring - Day*/
  'SKY_DAY': '80D7970B6650D41108D71083ECF0E49E',
  /** Sky ring - Night*/
  'SKY_NIGHT': '417DE573937D74E39BF40EB6CF82670B',
  /** Blackstone Arena - Day*/
  'BLACKSTONE_DAY': '975402A5539C6491789B36DC4D26D566',
  /** Blackstone Arena - Night*/
  'BLACKSTONE_NIGHT': '319DDC57E70174B6C85EF137BAF34E9E',
  /** Dragon Garden - Day*/
  'DRAGON_DAY': '1C67FA3426A324D39BED64501C46C1E6',
  /** Dragon Garden - Night*/
  'DRAGON_NIGHT': 'FFFFE4774561141D49B46892B5CBACFA',
  /** Mount Araz - Day*/
  'ARAZ_DAY': 'D57BBC373C35B426E93CB844B3C67C12',
  /** Mount Araz - Night*/
  'ARAZ_NIGHT': 'AB201E3B9454141FE9C9352CC296AD61',
  /** Orman Temple - Day*/
  'ORMAN_DAY': '02EF7F035729241EF81A9BC09463DD00',
  /** Orman Temple - Night*/
  'ORMAN_NIGHT': '3482480FED2AC482AA7DA471C1990591',
}

/**
* Map names
* @enum {String}
* @memberof Battlerite.maps
*/
const mapNames = {
  /** Sky Ring - Day*/
  '80D7970B6650D41108D71083ECF0E49E' : 'Sky Ring - Day',
  /** Sky ring - Night*/
  '417DE573937D74E39BF40EB6CF82670B' : 'Sky Ring - Night',
  /** Blackstone Arena - Day*/
  '975402A5539C6491789B36DC4D26D566' : 'Backstone Arena - Day',
  /** Blackstone Arena - Night*/
  '319DDC57E70174B6C85EF137BAF34E9E' : 'Backstone Arena - Night',
  /** Dragon Garden - Day*/
  '1C67FA3426A324D39BED64501C46C1E6' : 'Dragon Garden - Day',
  /** Dragon Garden - Night*/
  'FFFFE4774561141D49B46892B5CBACFA' : 'Dragon Garden - Night',
  /** Mount Araz - Day*/
  'D57BBC373C35B426E93CB844B3C67C12' : 'Mount Araz - Day',
  /** Mount Araz - Night*/
  'AB201E3B9454141FE9C9352CC296AD61' : 'Mount Araz - Night',
  /** Orman Temple - Day*/
  '02EF7F035729241EF81A9BC09463DD00' : 'Orman Temple - Day',
  /** Orman Temple - Night*/
  '3482480FED2AC482AA7DA471C1990591' : 'Orman Temple - Night',
}

/**
* Utilities for decoding map data
* @namespace
* @property {Object.<string, string>} name - Map with id as key and map name as value.
* @property {Object.<string, string>} id - Map with name as key and id as value. See {@link Battlerite.maps.mapIds} for valid names.
* @memberof Battlerite
*/
const maps = {
  name: mapNames,
  id: mapIds
}

module.exports = maps;
