// LIGHTWEIGHT CONFIGURATION MANAGER
// Made by ItzZed, meant for val-cli. // Config names and path names are hard coded in.
// Using fs for writing and saving files
import dotenv from "dotenv";
import inquirer from "inquirer";


dotenv.config("././.env");


export class ConfigManager {

	static constructor() {

		this.username = process.env.VCLI_USERNAME;
		this.password = process.env.VCLI_PASSWORD;
		this.puuid = process.env.VCLI_PUUID;

	}

	// SETUP ASK FOR USERNAME AND PASSWORD
	static async Setup() {


		await this.askForUsername();
		await this.askForPassword();

	}

	// Ask for username and password
	static async askForUsername() {

		let u = null;

		do {

			const aUsername = await inquirer.prompt({
				name: "username",
				type: "input",
				message: "What Is Your Username?",
				default() {
					return null;
				},
			});

			u = aUsername.username;


		} while (u == null);

		this.setUsername(u);

	}
	static async askForPassword() {

		let p = null;

		do {

			const aPassword = await inquirer.prompt({
				name: "password",
				type: "password",
				message: "What Is Your Password?",
				mask: "*",
				default() {
					return null;
				},
			});

			p = aPassword.password;


		} while (p == null);

		this.setPassword(p);

	}



	// GETTERS
	static getUsername() {

		return this.username;

	}
	static getPassword() {

		return this.password;

	}
	static getPUUID() {

		return this.puuid;

	}

	// SETTERS
	static setUsername(user) {

		process.env.VCLI_USERNAME = user;
		this.username = user;

	}
	static setPassword(pass) {

		process.env.VCLI_PASSWORD = pass;
		this.password = pass;

	}
	static setPUUID(pid) {

		process.env.VCLI_PUUID = pid;
		this.puuid = pid;

	}

}