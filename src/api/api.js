import axios from 'axios';
// No need for cookies when I can't auth due to 403... BRUH
// import { wrapper } from 'axios-cookiejar-support';
// import { CookieJar } from 'tough-cookie';

import {regions} from "./regions.js";

// see above
// wrapper(axios);


// API Class
export class API {

	// Give the api key, region (check regions.js to see the right region to overwrite), and the locale, you can do a Google to find it lol.
	constructor(apikey, region = regions.NorthAmerica, locale = "en-US") {

		// Constructor nonsense
		this.apikey = apikey;
		this.region = region;
		this.locale = locale;


		/*this.username = null;
		this.user_id = null;
		this.access_token = null;
		this.entitlements_token = null;
		this.client_version = 'release-04.01-shipping-11-659041';
		this.client_platform = {
			"platformType": "PC",
			"platformOS": "Windows",
			"platformOSVersion": "10.0.19042.1.256.64bit",
			"platformChipset": "Unknown"
		};*/

	}



	getValContent(region) {

		axios.get(`https://${this.region}.api.riotgames.com/val/content/v1/contents?locale=${this.locale}&api_key=${this.apikey}`).then(resp => {

			console.log(resp.data)

		});

	}

	getValStatus(region) {

		axios.get(`https://${this.region}.api.riotgames.com/val/status/v1/platform-data?locale=${this.locale}?api_key=${this.apikey}`).then(resp => {

			console.log(resp.data)

		});

	}



}