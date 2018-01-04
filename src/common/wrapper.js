const { resolveRelationships } = require('./relationships');

class Wrapper {
  constructor(data, reorganize) {
    if(!reorganize)
      Object.assign(this, data);
    else{
      let newData = data.data;
      Object.assign(this, resolveRelationships(newData, null));
    }
  }
}

module.exports = Wrapper;
