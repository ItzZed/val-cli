import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import url from "url";
import querystring from "querystring";
import {regions} from "./regions.js";


wrapper(axios);

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

	getPlayerDataServiceUrl(region) {
		return `https://pd.${region}.a.pvp.net`;
	}

	getPartyServiceUrl(region) {
		return `https://glz-${region}-1.${region}.a.pvp.net`;
	}

	getSharedDataServiceUrl(region) {
		return `https://shared.${region}.a.pvp.net`;
	}

	auth(username, password) {

		const jar = new CookieJar();

		return axios.post('https://auth.riotgames.com/api/v1/authorization', {

			"client_id": "play-valorant-web-prod",
			"nonce": "1",
			"redirect_uri": "https://playvalorant.com/opt_in",
			"response_type": "token id_token",

		}, {

			jar: jar,
			withCredentials: true,

		}).then(() => {

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
				let parsedUrl = url.parse(response.data.response.parameters.uri);

				let hash = parsedUrl.hash.replace("#", "");

				let parts = querystring.parse(hash);

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

	getValContent(region) {

		axios.get(`https://${this.region}.api.riotgames.com/val/content/v1/contents?locale=${this.locale}&api_key=${this.apikey}`).then(resp => {

			console.log(resp.data)

		});

	}

	getValStatus(region) {

		axios.get(`https://na.api.riotgames.com/val/status/v1/platform-data?api_key=${apikey}`).then(resp => {

			console.log(resp.data)

		});

	}



}