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

module.exports = {
  resolveRelationships
};
