#!/usr/bin/env node

// Imports
import chalk from "chalk";
import Table from "cli-table";
import { createSpinner } from "nanospinner"
import dotenv from "dotenv";

// Import API
import { API } from "./api/api.js";
import { ConfigManager } from "./utils/ConfigManager.js";



const api = new API();
dotenv.config({path: "./.env"});
const conf = new ConfigManager();
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));


let table = new Table({
	chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
		, 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
		, 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
		, 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
});


const startup = async () => {

	await conf.constructor.Setup();

};

const main = async () => {

	try {

		api.authorize(process.env.VCLI_USERNAME, process.env.VCLI_PASSWORD).then(async () => {

			let ign, tag, lvl, rank, rr, prank; // have not implemented peak rank yet and level

			process.env.VCLI_PUUID = api.user_id;

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

await startup();
await sleep();
const spinner = createSpinner('Loading...').start();
await main();