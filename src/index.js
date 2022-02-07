#!/usr/bin/env node

// Imports
import chalk from "chalk";
// import gradient from "gradient-string";
import Table from "cli-table";
import { createSpinner } from "nanospinner"

/*import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";*/
// Import API
import {API} from "./api/api.js";

// import { ConfigManager } from "./utils/ConfigManager.js";

// Api KEY HERE
// const key = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

// start the api up
// const api = new API(key);
const api = new API();

// const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));


let table = new Table({
	chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
		, 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
		, 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
		, 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
});


// console.log(`${chalk.bgBlueBright("Welcome to VAL-CLI!")} The Most Broken CLI EVER LOL!`);

// const spinner = createSpinner('Loading...').start();

const main = async () => {

	try {


		api.authorize("", "").then(async () => {

			let ign, tag, lvl, rank, rr, prank; // have not implemented peak rank yet and level


			// log auth data
			/*console.log({
				username: api.username,
				user_id: api.user_id,
				access_token: api.access_token,
				entitlements_token: api.entitlements_token,
			});*/

			await api.getMMRStats().then(async (resp) => {

				rank = resp.rankName;


				// rank = resp.rank;
				rr = resp.rankProgress;


				// console.log(resp);


			});

			await api.getIGNTag().then(async (resp) => {

				ign = resp.ign;
				tag = resp.tag;

			});


			// Table Data
			table.push(
				[chalk.blueBright("Name"), chalk.blueBright("Level"), chalk.blueBright("Rank"), chalk.blueBright("RR"), chalk.blueBright("Peak Rank")],
				[chalk.cyanBright(ign) + chalk.cyan("#" + tag), chalk.yellowBright("W.I.P"), chalk.cyanBright(rank), chalk.cyanBright(rr), chalk.yellowBright("W.I.P")],
			);

			let tableString = table.toString();

			// await sleep();

			// spinner.success({text: "Val-Cli Results: "});
			console.log(tableString);


		}).catch((e) => {
			// spinner.error({text: "Error Occurred!"});
			console.log(e);

		});

	} catch (e) {

		console.log(e);

	}

};

await main();