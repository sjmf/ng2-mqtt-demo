import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Config } from './config.ts';

/**
 * An injected class which grabs the application
 * config variables (e.g. MQ  credentials)
 * for the user application.
 *
 * This makes an AJAX request to the server
 * api containing some user token and secret
 *
 * @type ConfigService
 */
@Injectable()
export class ConfigService {

    // Note: can serve this configuration from a real API: see the ng-cli
    // documentation at https://github.com/angular/angular-cli#proxy-to-backend
    private static API_URL: string = 'assets/api/config.json';

    // TODO: Provide a user object to the constructor
    //       to allow retrieval of per-user configs
    //       or from a specific URL.
    constructor( public _http:Http ) { }


    /** Make an http request for a config file, and
      * return a Promise for its resolution.
      */
    getConfig(): Promise<Config> {
        return this._http.get(ConfigService.API_URL)
            .map(res => res.json())
            .toPromise();
    }
}
