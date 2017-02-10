# MQTT Angular 2 Demo App

> A demo application using [Angular 2](https://github.com/angular/angular),
[Typescript](https://github.com/Microsoft/TypeScript), and 
[mqtt.js](https://github.com/mqttjs/MQTT.js). This project uses 
[angular-cli](https://github.com/angular/angular-cli) 
and is a re-write of my [earlier example using stomp.js](https://github.com/sjmf/ng2-stompjs-demo)
(where I really should have foreseen that the transport doesn't need to 
be tied to one library. Well, you live and learn.)

This app demonstrates a more ng2-faithful way of connecting to a message 
queue and subscribing to messages via MQTT. It includes an MQService 
which subscribes to messages, and an example 'raw data' component which 
uses the Observable type to data-bind messages to the DOM.


## Quick Start 

> As well as the following, you will also need the appropriate toolchain for 
> Typescript, and a message queue supporting MQTT, such as [ActiveMQ](http://activemq.apache.org/).

To get started running this app locally, install [angular-cli](https://github.com/angular/angular-cli) 
and the necessary dependencies:

```bash
# Clone the repo and cd into it
git clone https://github.com/sjmf/ng2-mqtt-demo
# cd into it
cd ng2-mqtt-demo
# Install the packages from package.json
npm install
```

You will also need to edit the `src/api/config.json` configuration 
file to set the correct connection parameters for your message broker. 
This file is included with the idea that in a production app, you might 
want to get credentials for a connection from an API. See the 
angular-cli instructions for [proxying to a backend](https://github.com/angular/angular-cli#proxy-to-backend)
for more information. 

When you've done this, you can run the application locally: run `ng serve` 
for a dev server. Navigate to `http://localhost:4200/`. The app will 
automatically reload if you change any of the source files.


## Layout

The source is located under the `app` folder. Partial tree is below:

```
├── src                                          * Source folder
│   ├── api                                      * Example API folder (static for demo)
│   │   └── config.json                          * Configuration file for STOMP
│   │
│   ├── app                                      * Application folder
│   │   ├── components                           * Components folder
│   │   │   ├── rawdata                          * Example data streaming component folder
│   │   │   └── status                           * STOMP Status component folder
│   │   │
│   │   ├── services                             * Services folder
│   │   │   ├── config                           * Config service folder (retrieves the configuration)
│   │   │   └── stomp                            * STOMP service folder (ng2 definition for a STOMP configuration)
│   │   │
│   │   ├── app.component.css                    * Component css file
│   │   ├── app.component.html                   * Component html file
│   │   ├── app.component.spec.ts                * Component testings
│   │   ├── app.component.ts                     * Top-level app-root component
│   │   ├── app.module.ts                        * App module definition
│   │   └── index.ts                             * Indexing file
│   │
│   ├── assets                                   * Assets folder
│   │   └── .gitkeep                             * Placeholder to include the folder to source control
│   │
│   ├── environments                             * Environment settings folder
│   │   ├── environment.prod.ts                  * Production environment settings
│   │   └── environment.ts                       * Development environment settings
│   │
│   ├── index.html                               * The root page served to browser
│   ├── main.ts                                  * App bootstrap
│   ├── styles.css                               * Main css file
│   ├── tsconfig.json                            * Typescript transpiler options 
│   └── typings.d.ts                             * Typescript typings definition file
│
├── angular-cli.json                             * Angular CLI configuration file
├── package.json                                 * Package info and list of dependencies to install
└── tslint.json                                  * Typescript Linter configuration file
```

> Excluded from this partial tree for brevity: sub-component `.ts` `.html` etc 
files under folders, testing framework files, and the `e2e` End to End testing 
folder containing app behaviour testings and definitions. The `node_modules` 
directory will also be generated for the installed node packages.)


## Extending

The example data streaming component provides a demonstration of how to use the
`MQService` to subscribe to a data stream. At its' core, the `MQService` makes
available an Observable which the `RawDataComponent` uses in its own template, 
and additionally subscribes its' own `on_next` method to.

A barebones set-up of the service could run from a component's `ngOnInit`
method, and might look something like this:
```
this._mqService.configure( config, () => console.log("connected") );
this._mqService.try_connect();
```

Our `RawDataComponent` then copies a reference to the public member `messages`,
which can be used with a template variable and the `|async` pipe to update the
template in real time.

The instantiating component must provide an instance of MQService. This
implementation also uses a ConfigService to retrieve the MQTT connection
variables from a json file, with the intention that other clients might like to
route this request to an API along with some form of user token.

The MQTT connection status is also fed-back to the application user via a
`BehaviorSubject` observable, implemented following the model used in 
this [Angular2 stocks app](https://github.com/jeffbcross/aim). If the connection
fails, the application will retry every 5 seconds until it reopens.


## Contributing

Very happy to accept suggestions for improvement (or even pull requests!). 
Just raise an issue and let me know :) - I'll try and work on it when I
get time.

## Licence

MIT Licence.

