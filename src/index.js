#!/usr/bin/env node

// Imports
import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner"

// Import API
import { API } from "./api/api.js";

// Api KEY HERE
const key = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

// start the api up
const api = new API(key);

console.log(`${chalk.bgBlueBright("Welcome to VAL-CLI!")} The Most Broken CLI EVER LOL!`);

try {

	api.getValContent();

}
catch(e) {

	/*if(e.response.data.status.statusCode === 403) {

		console.log(`${chalk.bgRed("F YOU RIOT GIVING ME 403 ERROR  GOD DAMINT")}`);
		console.log(`${chalk.bgBlueBright("this probably means either api key is wrong or riot is fucking with me :)")}`);

	}
	else if(e.response.status === 401) {

		console.log(`${chalk.bgRed("F YOU RIOT GIVING ME 401 ERROR  GOD DAMINT")}`);
		console.log(`${chalk.bgGreenBright("shit i forgot the api key sorry riot")}`);

	}
	else {

		console.log("unknown status error begins");
		console.log(e);
		console.log("unknown status error ends");

	}*/

	// why wont the above catch work? idk lol sorry for swears its like 1am
	// brruh what the fuck is this code
	console.log(e);

}
