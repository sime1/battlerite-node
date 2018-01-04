# battlerite-node
A node.js SDk for accessing the official Battlerite API.
## Getting started
To start using battlerite-node, you just have to install the npm module:
```
npm install --save battlerite-node
```
## Basic usage
First you need to require the module inside your file:
```
const Battlerite = require('battlerite-node');
```
then before trying to retrieve any data, the module needs to know your API key:
```
Battlerite.config({key: 'yourAPIkey'});
```
To retrieve a list of matches:
```
Battlerite.Match.getList().then((matches) => {
  matches.forEach(doSomethingWithMatchData);
}).catch(console.error);
```
you can also choose which matches to retrieve:
```
Battlerite.Match.getList({page:{limit:2}}).then((matches) => {
  matches.forEach(doSomethingWithMatchData);
}).catch(console.error);
```
To retrieve a single match:
```
Battlerite.Match.get(id).then((match) => {
  doSomething(match);
}).catch(console.error);
```
To fetch telemetry data:
```
Battlerite.Match.get(id).then((match) => {
  return match.getTelemetry();
}).then((telemetry) => {
  doSomethingFancyWithTelemetryData(telemetry);
}).catch(console.error);
```
## Documentation
For detailed information about the usage of battlerite-node, you can find the documentation [here](https://sime1.github.io/battlerite-node)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Changelog
0.1.0: initial Release

0.1.1: added README to npm

0.1.2: fixed bug with match list download

0.2.0: now resolving relationships also merge attributes into the object. This way Match objects actually reflect the documentation. Added enums for maps and champions

0.2.1: quick fix to export maps

0.2.2: fix telemetry data fetching

0.3.0: Player functionalities

0.4.0: Team functionalities, minor documentation corrections
