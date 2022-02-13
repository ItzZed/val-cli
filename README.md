<div align="center">
   <img src="./val-cli-icon.svg" width="400"></a>

   <a href="https://www.npmjs.com/package/val-cli"><img src="https://badgen.net/npm/v/val-cli?color=red" alt="NPM-Version"/></a>
   <a href="https://www.npmjs.com/package/val-cli"><img src="https://badgen.net/npm/dt/val-cli?color=red" alt="NPM-Downloads"/></a>
   
   <p>CLI that shows your valorant stats</p>

   <a href="https://www.npmjs.com/package/val-cli"><img src="https://nodei.co/npm/val-cli.png" alt="NPM"/></a>

</div>

# Install


- Install [Node.js](https://nodejs.org/en/) (Project Made On Node.js version v16.13.2)

## Getting Started



### Recommended

- Install via [npm](https://www.npmjs.com/package/val-cli)
```
npm install -g val-cli
```
- Run in command line
```
val-cli
```

### Manually
- Clone the repository
```
git clone https://github.com/ItzZed/val-cli.git
```
- Install dependencies
```
cd val-cli
npm install
```

## Usage/Examples

Run the project
```
val-cli
```

## Known Bugs
* On first open the program will not work and spam auth error + a config file not being found
   * To circumvent this run ***val-cli --setup***
* entering any config command besides --setup causes problems...
* DOES NOT SUPPORT 2FA
* Config file loading is just straight up jenky

## TODO'S

- [ ]  Get Functional CLI
   - [x]  Show Valorant Rank + MMR
   - [ ]  Show Stats (i.e K/D/A, and Winrate %)
   - [ ]  Finish "W.I.P" Stats
- [ ] More Config Options
- [ ] Refactor and remove deprecated stuff
- [ ] Semi-Encrypt User Password Cuz Plaintext Aint Good...



This project is not complete and is extremely unstable, use at your own risk.