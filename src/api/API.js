import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import {regions} from "./regions.js";
import tls from 'tls';
import https from "https";


wrapper(axios);


// Riot Auth Urls
/*const authUrl = "https://auth.riotgames.com/api/v1/authorization";
const entitleUrl = "https://entitlements.auth.riotgames.com/api/token/v1";
const userInfoUrl = "https://auth.riotgames.com/userinfo";
const regionUrl = "https://riot-geo.pas.si.riotgames.com/pas/v1/product/valorant";
const gameEntitlementUrl = "https://clientconfig.rpg.riotgames.com/api/v1/config/player";*/
// const cookieJson = "{\"client_id\":

// Error 403 TLS fingerprinting bypass
const defaultCiphers = tls.DEFAULT_CIPHERS.split(':');
const shuffledCiphers = [
	defaultCiphers[0],
	// Swap the 2nd & 3rd ciphers:
	defaultCiphers[2],
	defaultCiphers[1],
	...defaultCiphers.slice(3)
].join(':');

const agent = new https.Agent({ ciphers: shuffledCiphers });


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

		// Setup CookieJar
		const jar = new CookieJar();

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
			httpsAgent: agent,

		};

		return await axios(data).then(() => {

			return axios.put('https://auth.riotgames.com/api/v1/authorization', {

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
				let parsedUrl = URL.parse(response.data.response.parameters.uri);

				let hash = parsedUrl.hash.replace("#", "");

				let parts = URLSearchParams.parse(hash);

				return parts.access_token

			});
		}).then((access_token) => {

			return axios.post('https://entitlements.auth.riotgames.com/api/token/v1',{},{

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

		}).then(() => {

			return axios.post('https://auth.riotgames.com/userinfo',{},{

				jar: jar,
				withCredentials: true,
				headers: {

					'Authorization': `Bearer ${this.access_token}`,
				},

			}).then((response) => {

				this.user_id = response.data.sub;

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