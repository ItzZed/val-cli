#!/usr/bin/env node

// Imports
import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner"

// Import API
import {API} from "./api/api.js";


const api = new API();

api.auth('', '').then(() => {
	// auth was successful, go make some requests!


}).catch((error) => {
	console.log(error);
});

