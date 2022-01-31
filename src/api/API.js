import axios from 'axios';
// import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import {regions} from "./regions.js";
import url from 'url';
import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent';


// wrapper(axios);


// Riot Auth Urls
/*const authUrl = "https://auth.riotgames.com/api/v1/authorization";
const entitleUrl = "https://entitlements.auth.riotgames.com/api/token/v1";
const userInfoUrl = "https://auth.riotgames.com/userinfo";
const regionUrl = "https://riot-geo.pas.si.riotgames.com/pas/v1/product/valorant";
const gameEntitlementUrl = "https://clientconfig.rpg.riotgames.com/api/v1/config/player";*/

// not posting ciphers sorry fam.

import { ciphers } from "./ciphers.js";

// Setup CookieJar
const jar = new CookieJar();

// Bypass for 403, add ciphers to agent.
axios.defaults.httpAgent = new HttpCookieAgent({
	keepAlive: true,
	rejectUnauthorized: false,
	jar,
	ciphers: ciphers,
});
axios.defaults.httpsAgent = new HttpsCookieAgent({
	keepAlive: true,
	rejectUnauthorized: false,
	jar,
	ciphers: ciphers,
});
axios.defaults.headers.common = {
	'User-Agent': 'RiotClient/43.0.1.4195386.4190634 rso-auth (Windows;10;;Professional, x64)',
	Accept: '*/*',
};




export class API {

	constructor(region = regions.NorthAmerica) {

		this.region = region;
		this.username = null;
		this.user_id = null;
		this.access_token = null;
		this.entitlements_token = null;
		this.client_version = 'release-04.01-shipping-11-659041';
		this.client_platform = {
			"platformType": "PC",
			"platformOS": "Windows",
			"platformOSVersion": "10.0.19042.1.256.64bit",
			"platformChipset": "Unknown"
		};

	}

	async authorize(username, password) {

		let data = {

			method: 'POST',
			url: 'https://auth.riotgames.com/api/v1/authorization',
			headers: {

				jar: jar,
				withCredentials: true,
				'Content-Type': 'application/json',
				'User-Agent': 'RiotClient/43.0.1.4195386.4190634 rso-auth (Windows;10;;Professional, x64)'

			},
			data: {
				client_id: 'play-valorant-web-prod',
				nonce: '1',
				redirect_uri: 'https://playvalorant.com/opt_in',
				response_type: 'token id_token',
				scope: 'account openid'
			},

		};

		return await axios(data).then(async () => {

			return await axios.put('https://auth.riotgames.com/api/v1/authorization', {

				"type": "auth",
				"username": username,
				"password": password

			}, {
				jar: jar,
				withCredentials: true,
			}).then((response) => {

				// Check for any errors
				if (response.data.error) {

					throw new Error(response.data.error);

				}

				// Parse the url
				let parsedUrl = url.parse(response.data.response.parameters.uri);

				let hash = parsedUrl.hash.replace("#", "");

				let parts = new URLSearchParams(hash);

				return parts.get('access_token');

			});
		}).then(async (access_token) => {

			return await axios.post('https://entitlements.auth.riotgames.com/api/token/v1', {}, {

				jar: jar,
				withCredentials: true,
				headers: {


					'Authorization': `Bearer ${access_token}`,
				},

			}).then((response) => {

				this.username = username;
				this.access_token = access_token;
				this.entitlements_token = response.data.entitlements_token;

			});

		}).then( async() => {

			data = {

				method: 'GET',
				url: 'https://auth.riotgames.com/userinfo',
				headers: {
					jar: jar,
					withCredentials: true,
					'Content-Type': 'application/json',
					'User-Agent': 'RiotClient/43.0.1.4195386.4190634 rso-auth (Windows;10;;Professional, x64)',
					'Authorization': `Bearer ${this.access_token}`,

				},
				data: {
					client_id: 'play-valorant-web-prod',
					nonce: '1',
				},

			};

			return await axios(data).then((response) => {

				console.log("hooray");

			});

		});

	}

	async getPlayerInfo() {

		// Get Player PUUID
		axios.get("https://auth.riotgames.com/userinfo", {}, {

			withCredentials: true,
			headers: {

				'Authorization': `Bearer ${this.access_token}`,
			},

		}).then((resp) => {

			this.user_id = resp;
			console.log("UserID: " + resp);

		}).catch(function (error) {

			console.error(error);

		});

	}

}