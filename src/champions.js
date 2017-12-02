/**
* Champion Ids. 
* @enum {String}
* @memberof Battlerite.champions
*/
const championIds = {
  /** Jumong*/
  JUMONG: '39373466',
  /** Lucie*/
  LUCIE: '467463015',
  /** Shifu*/
  SHIFU: '763360732',
  /** Ezmo*/
  EZMO: '1377055301',
  /** Sirius*/
  SIRIUS: '259914044',
  /** Iva*/
  IVA: '842211418',
  /** Jade*/
  JADE:	'65687534',
  /** Ruh Kaan*/
  RUH_KAAN:	'550061327',
  /** Oldur*/
  OLDUR:	'1908945514',
  /** Ashka*/
  ASHKA:	'1',
  /** Varesh*/
  VARESH:	'369797039',
  /** Pearl*/
  PEARL:	'44962063',
  /** Taya*/
  TAYA:	'154382530',
  /** Poloma*/
  POLOMA:	'1134478706',
  /** Croak*/
  CROAK:	'1208445212',
  /** Freya*/
  FREYA:	'1606711539',
  /** Bakko*/
  BAKKO:	'1422481252',
  /** Rook*/
  ROOK:	'1318732017',
  /** Pestilus*/
  PESTILUS:	'1649551456',
  /** Destiny*/
  DESTINY: 	'870711570',
  /** Raigon*/
  RAIGON:	'1749055646',
  /** Blossom*/
  BLOSSOM:	'543520739',
  /** Thorn*/
  THORN:	'1463164578'
}

/**
* Champion names
* @enum {String}
* @readonly
* @memberof Battlerite.champions
*/
const championNames = {
  /** Jumong*/
  '39373466': 'Jumong',
  /** Lucie*/
  '467463015': 'Lucie',
  /** Shifu*/
  '763360732': 'Shifu',
  /** Ezmo*/
  '1377055301': 'Ezmo',
  /** Sirius*/
  '259914044': 'Sirius',
  /** Iva*/
  '842211418': 'Iva',
  /** Jade*/
  '65687534': 'Jade',
  /** Ruh Kaan*/
  '550061327': 'Ruh Kaan',
  /** Oldur*/
  '1908945514': 'Oldur',
  /** Ashka*/
  '1': 'Ashka',
  /** Varesh*/
  '369797039': 'Varesh',
  /** Pearl*/
  '44962063': 'Pearl',
  /** Taya*/
  '154382530': 'Taya',
  /** Poloma*/
  '1134478706': 'Poloma',
  /** Croak*/
  '1208445212': 'Croak',
  /** Freya*/
  '1606711539': 'Freya',
  /** Bakko*/
  '1422481252': 'Bakko',
  /** Rook*/
  '1318732017': 'Rook',
  /** Pestilus*/
  '1649551456': 'Pestilus',
  /** Destiny*/
  '870711570': 'Destiny',
  /** Raigon*/
  '1749055646': 'Raigon',
  /** Blossom*/
  '543520739': 'Blossom',
  /** Thorn*/
  '1463164578': 'Thorn'
}

/**
* Utilities for decoding champion data
* @namespace
* @property {Object.<string, string>} name - Map with id as key and champion name as value.
* @property {Object.<string, string>} id - Map with name as key and id as value. See {@link Battlerite.champions.championIds} for valid names.
* @memberof Battlerite
*/
const champions = {
  name: championNames,
  id: championsIds
}

module.exports = champions;
