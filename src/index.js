#!/usr/bin/env node

// Imports
import fs from "fs";
import chalk from "chalk";
import Table from "cli-table";
import { createSpinner } from "nanospinner"
import dotenv from "dotenv";

// Import API
import { API } from "./api/api.js";
import { ConfigManager } from "./utils/ConfigManager.js";
import {ArgumentHandler} from "./utils/ArgumentHandler.js";

// Constants
const api = new API();
dotenv.config({path: "./.env"});
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
const cPath = "./config.json";

// Variables
let args = process.argv
let table = new Table({
	chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
		, 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
		, 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
		, 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
});

// Functions
const argHandler = async () => {

	const argSetup = new ArgumentHandler(args);

	let argToggles = argSetup.commandSettings();

	if((await argToggles).setup === true) {

		await setupModeToggleOn();

	}

};

const startup = async () => {

	let jsonData;
	// Check if first run or config file is empty.
	try {

		let data = fs.readFileSync(cPath, ({ encoding: "utf8" }));

		jsonData = JSON.parse(data);

		if (jsonData.setup === true) {

			// Setup mode
			await ConfigManager.Setup();

			// SAVE PROCESS ENV STUFF TO CONFIG.JSON!

			await saveToConfig();

		} else {

			ConfigManager.setUsername(jsonData.username);
			ConfigManager.setPassword(jsonData.password);
			ConfigManager.setPUUID(jsonData.puuid);

		}

	}
	catch (e) {

		console.log(e);

	}



};

const main = async () => {

	try {

		api.authorize(process.env.VCLI_USERNAME, process.env.VCLI_PASSWORD).then(async () => {

			let ign, tag, lvl, rank, rr, prank; // have not implemented peak rank yet and level

			process.env.VCLI_PUUID = api.user_id;

			// Save credentials (MAINLY PUUID) to config
			await saveToConfig();

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

			spinner.success({text: "Loaded!"});
			console.log(tableString);


		}).catch((e) => {
			spinner.error({text: "Error Occurred!"});
			console.log(e);

		});

	} catch (e) {

		console.log(e);

	}

};

const saveToConfig = async () => {

	let data = {
		username: process.env.VCLI_USERNAME,
		password: process.env.VCLI_PASSWORD,
		puuid: process.env.VCLI_PUUID,
		setup: false
	};

	// Make data into json format. null is to get to space where it can be pretty printed via the random 4 below.
	let jsonData = JSON.stringify(data, null, 4);

	fs.writeFileSync(cPath, jsonData);

}

const setupModeToggleOn = async () => {

	let data = {
		username: "",
		password: "",
		puuid: "",
		setup: true
	};

	// Make data into json format. null is to get to space where it can be pretty printed via the random 4 below.
	let jsonData = JSON.stringify(data, null, 4);

	fs.writeFileSync(cPath, jsonData);

}

// PROGRAM RUNS
// Check For Args and Handle it
await argHandler();
// Startup is misleading, the program checks for args then runs startup.
await startup();
// Wait 2s
await sleep();
// Cool Spinner thing
const spinner = createSpinner('Loading...').start();
// Run the program! PogChamp
await main();