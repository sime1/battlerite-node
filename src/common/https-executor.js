const https = require('https');

function httpsExecutor (url){
  return ((resolve, reject) => {
    https.get(url, (res) => {
      if(res.statusCode !== 200){
        reject(new Error('Status code : ' + res.statusCode));
        return;
      }
      let data = '';
      res.on('data', (chunk) => { data += chunk;});
      res.on('end', () => {
        try{
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch(err) {
          reject(new Error('Error parsing data: ' + err.message));
        }
      }).on('error', (err) => {
        reject(new Error('Error receiving data: ' + err.message))
      });
    })
  });
}

module.exports = httpsExecutor;
