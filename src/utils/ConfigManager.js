// CURRENTLY NOT WORKING, ILL FIX ONCE I GET CLI WORKING

import config from "config";
import inquirer from "inquirer";
import {API} from "../api/API.js";

const api = new API();

const cUsername = config.get("User.username");
const cPassword = config.get("User.password");
const cPUUID = config.get("User.puuid");
const cFirstRun = config.get("FirstRun");

export class ConfigManager {

	// FirstTime Setup
	static async Setup() {

		cUsername.set(this.getUsername());
		cPassword.set(this.getPassword());
		cPUUID.set(this.getPUUID());
		cFirstRun.set(false);

	}

	static async getUsername() {

		let username = null;

		do {

			const gUsername = await inquirer.prompt({
				name: "username",
				type: "input",
				message: "What Is Your Username?",
				default() {
					return null;
				},
			});

			username = gUsername.username;


		} while(username == null);

		return username;


	}

	static async getPassword() {

		let password = null;

		do {

			const gPassword = await inquirer.prompt({
				name: "password",
				type: "input",
				message: "What Is Your Password?",
				default() {
					return null;
				},
			});

			password = gPassword.password;


		} while(password == null);

		return password;


	}

	static async getPUUID() {

		try {

			api.authorize(cUsername, cPassword).then(() => {

				return api.user_id;

			});

		}
		catch (e) {

			console.log("CONFIGMANAGER ERROR: getPUUID()");
			console.log(e);

		}

	}

	static IsConfigured() {

		return !cFirstRun;

	}

}