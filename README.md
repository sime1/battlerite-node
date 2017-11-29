# battlerite-node
A node.js SDk for accessing the official Battlerite API.
## Getting started
To start using battlerite-node, you just have to install the npm module: 
```
npm install --save battlerite-node
```
then require the module inside your file:
```
...
const Battlerite = require('battlerite-node');

Battlerite.Match.getList().then((matches) => {
  matches.forEach((match) => {
    match.getTelemetry().then(doSomethingWithTelemetryData);
  }).catch(console.error);
}).catch(console.error);
...
```
## Documentation
You can find the documentation of battlerite-node [here](https://sime1.github.io/battlerite-node)
## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
