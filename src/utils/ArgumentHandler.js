// Argument Handler, when the cli has an argument it will be parsed and the variables/booleans will be toggled here.
let	argMap;

// ARGUMENT TOGGLES
// TRUE = ON, FALSE = OFF
let setupMode = false; // Overwritten by config if is true.

// A lot of duplicates to support users entering different names for arguments. (user-friendly nonsense)
let setupArgs = [
	"setup",
	"--setup",
	"config",
	"--config",
	"configure",
	"--configure"
];

export class ArgumentHandler {

	constructor (args) {

		argMap = Object.entries(args).map(([, value]) => {

			return value.toLowerCase();

		})

	}

	async parseArgs() {

		// If args has any value from setupArgs then turn on or off setupMode!
		argMap.forEach(parseArgMap);

		function parseArgMap(item, index, arr) {

			if(arr.some(v => setupArgs.indexOf(v) >= 0)) {

				setupMode = true;

			}

		}

	}

	// returns all toggles for args
	async commandSettings() {

		await this.parseArgs();

		// Return toggles
		return {

			"setup": setupMode

		};

	}



}
