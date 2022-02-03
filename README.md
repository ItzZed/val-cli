# IN VERY EARLY DEVELOPMENT DO NOT USE!

# val-cli

CLI that shows your valorant stats

# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) (Project Made On Node.js version v16.13.2)

## Getting Started
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

In val-cli/src/index.js, change "username" and "password" to your VALORANT credentials.
```javascript
api.authorize("username", "password").then(() => {

```

- Run the project
```
npm start
```

## TODO'S

- [ ]  Get Functional CLI
    - [ ]  Show Valorant Rank + MMR
    - [ ]  Show Stats (i.e K/D/A, and Winrate %)