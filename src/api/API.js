"use strict";

import axios from 'axios';
// import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import {regions} from "./regions.js";
import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent';
import { ciphers } from "./ciphers.js";
import {Tiers} from "./tiers.js";

// wrapper(axios);


// Riot Auth Urls
/*const authUrl = "https://auth.riotgames.com/api/v1/authorization";
const entitleUrl = "https://entitlements.auth.riotgames.com/api/token/v1";
const userInfoUrl = "https://auth.riotgames.com/userinfo";
const regionUrl = "https://riot-geo.pas.si.riotgames.com/pas/v1/product/valorant";
const gameEntitlementUrl = "https://clientconfig.rpg.riotgames.com/api/v1/config/player";*/

// not posting ciphers sorry fam.



// Setup CookieJar
const jar = new CookieJar();

// Bypass for 403, add ciphers to agent.
const httpAgent = new HttpCookieAgent({
  keepAlive: true,
  rejectUnauthorized: false,
  jar,
  ciphers: ciphers,
});
const httpsAgent = new HttpsCookieAgent({
  keepAlive: true,
  rejectUnauthorized: false,
  jar,
  ciphers: ciphers,
});
const agents = {
  httpAgent,
  httpsAgent,
}
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
		this.client_version = 'release-04.08-15-701907';
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
      		...agents,
			headers: {
				//jar: jar,
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
				"password": password,
			}, {
        		...agents,
				//jar: jar,
				withCredentials: true,
			}).then((response) => {

				// Check for any errors
				if (response.data.error) {

					throw new Error(response.data.error);

				}

				// Parse the url
				// DEPRECATED   let parsedUrl = url.parse(response.data.response.parameters.uri)
				let parsedUrl = new URL(response.data.response.parameters.uri)

				let hash = parsedUrl.hash.replace("#", "");

				let parts = new URLSearchParams(hash);

				return parts.get('access_token');

			});

		}).then(async (access_token) => {

			return await axios.post('https://entitlements.auth.riotgames.com/api/token/v1', {}, {

        		...agents,
				//jar: jar,
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

			return await this.getPlayerInfo();

		});

	}

	async getPlayerInfo() {

		// Get Player PUUID

		const data = {
		  method: "GET",
		  url: "https://auth.riotgames.com/userinfo",
		  headers: {
			withCredentials: true,
			"Content-Type": "application/json",
			"User-Agent":
			  "RiotClient/43.0.1.4195386.4190634 rso-auth (Windows;10;;Professional, x64)",
			Authorization: `Bearer ${this.access_token}`,
		  },
		  data: {
			client_id: "play-valorant-web-prod",
			nonce: "1",
		  },
		};

		return await axios(data).then(async (resp) => {

			this.user_id = resp.data.sub;
			return await resp.data;

		});

	}

	async getUsernameTag() {

		let puuid = JSON.parse(JSON.stringify(this.user_id));

		const data = {
			method: "PUT",
			url: `https://pd.${this.region}.a.pvp.net/name-service/v2/players`,
			headers: {
				withCredentials: true,
				"User-Agent": "RiotClient/43.0.1.4195386.4190634 rso-auth (Windows;10;;Professional, x64)",
				"Authorization": `Bearer ${this.access_token}`,
				"X-Riot-Entitlements-JWT": this.entitlements_token,
				"X-Riot-ClientVersion": this.client_version,
				"X-Riot-ClientPlatform": Buffer.from(JSON.stringify(this.client_platform)).toString('base64'),
				...agents,
			},
			data: [puuid],
		};

		return await axios(data).then(async (resp) => {

			return resp.data;

		});

	}

	// Gets Rank and Updates
	async getMMRUpdates() {

		const data = {
			method: "GET",
			url: `https://pd.${this.region}.a.pvp.net/mmr/v1/players/${this.user_id}`,
			headers: {
				withCredentials: true,
				"Content-Type": "application/json",
				"User-Agent": "RiotClient/43.0.1.4195386.4190634 rso-auth (Windows;10;;Professional, x64)",
				"Authorization": `Bearer ${this.access_token}`,
				"X-Riot-Entitlements-JWT": this.entitlements_token,
				"X-Riot-ClientVersion": this.client_version,
				"X-Riot-ClientPlatform": Buffer.from(JSON.stringify(this.client_platform)).toString('base64'),
			},
			data: {
				client_id: "play-valorant-web-prod",
				nonce: "1",
			},
		};

		return await axios(data).then(async (resp) => {

			return await resp.data;

		});

	}

	async getMMRStats() {

		// Make Data Array Thing, To Store MMR Stats
		let data = {

			"rank": null,
			"rankName": null,
			"rankProgress": null,
			"elo": null,

		};

		return await this.getMMRUpdates().then(async (resp) => {

			//if(resp.data.LatestCompetitiveUpdate) {
			try {

				const update =  await resp.LatestCompetitiveUpdate;

				data.rank = await update.TierAfterUpdate;
				data.rankName = await Tiers[update.TierAfterUpdate];
				data.rankProgress = await update.RankedRatingAfterUpdate;
				data.elo = await this.calculateElo(data.rank, data.rankProgress);

				// }
				// else {

				// console.log(chalk.bgRed("NO RANK DATA!") + chalk.red("Have you played any competitive games yet?"));

				// }



				return data;

			}
			catch(ex) {

				console.log(ex);

			}

		});

	}

	async getIGNTag() {

		let userTag = {

			"ign": null,
			"tag": null

		};

		return await this.getUsernameTag().then(async (resp) => {

			try {

				userTag.ign = await resp[0].GameName;
				userTag.tag = await resp[0].TagLine;

				return userTag;

			}
			catch(ex) {

				console.log(ex);

			}

		});

	}

	calculateElo(tier, progress) {

		if(tier >= 21) {
			// Immortal+
			return 1800 + progress;

		} else {
			// returns elo
			return ((tier * 100) - 300) + progress;

		}
	}

}