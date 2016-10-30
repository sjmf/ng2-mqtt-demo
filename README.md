# MQTT Angular 2 Demo App

> A demo application using [Angular 2](https://github.com/angular/angular)+
[Typescript](https://github.com/Microsoft/TypeScript), and 
[mqtt.js](https://github.com/mqttjs/MQTT.js). This project uses 
[angular-cli](https://github.com/angular/angular-cli) 
version 1.0.0-beta.15 and is a re-write of my [earlier example using stomp.js](https://github.com/sjmf/ng2-stompjs-demo)
(where I really should have foreseen that the transport doesn't need to 
be tied to one library. Well, you live and learn.)

This app demonstrates a more ng2-faithful way of connecting to a message 
queue and subscribing to messages from a message queue via MQTT, 
includes an MQService which subscribes to messages, and an example 
'raw data' component which uses the Observable type to data-bind
messages to the DOM.


## Quick Start 

> As well as the following, you will also need the appropriate toolchain for 
> Typescript, and a message queue supporting MQTT, such as [ActiveMQ](http://activemq.apache.org/).

To get started running this app locally, install [angular-cli](https://github.com/angular/angular-cli) 
and the necessary dependencies:

```bash
# Clone the repo and cd into it
git clone https://github.com/sjmf/ng2-mqtt-demo
cd ng2-mqtt-demo
# Install angular-cli
npm install -g angular-cli
# Install the packages from package.json
npm install
```

You will also need to edit the `src/assets/api/config.json` configuration 
file to set the correct connection parameters for your message broker. 
This file is included with the idea that in a production app, you might 
want to get credentials for a connection from an API. See the 
angular-cli instructions for [proxying to a backend](https://github.com/angular/angular-cli#proxy-to-backend)
for more information. 

When you've done this, you can run the application locally: run `ng serve` 
for a dev server. Navigate to `http://localhost:4200/`. The app will 
automatically reload if you change any of the source files.


## Layout

The source is located under the `app` folder. Partial tree is below
(I've excluded a lot of angular-cli's boilerplate):

```
src                                  * Source folder
├── app                              
│   ├── app.component.css            * Top-level app component
│   ├── app.component.html           
│   ├── app.component.ts             
│   ├── app.module.ts                * App NgModule definition
│   ├── index.ts                     
│   ├── pipes                        * Pipes used in the application
│   │   └── reverse.pipe.ts          
│   ├── rawdata                      * RawDataComponent viewer which
│   │   ├── rawdata.component.css      renders messages in a div so 
│   │   ├── rawdata.component.html     that you can see them
│   │   └── rawdata.component.ts     
│   ├── services                     
│   │   ├── config.service.ts        * Service to retrieve user config
│   │   ├── config.ts                * Type definition for MQTT config
│   │   ├── mqtt.service.ts          * MQTT ng2 service definition
│   │   └── transport.service.ts     
│   ├── shared                       
│   │   └── index.ts                 
│   └── status                       * Status component (states like
│       ├── status.component.css       TRYING, CONNECTED, DISCONNECTED,
│       ├── status.component.html      and so on)
│       ├── status.component.spec.ts 
│       └── status.component.ts      
├── assets                           
│   └── api                          
│       └── config.json              * Configuration file for MQTT broker
└── index.html                       * App page served to browser
```

Two extra directories will be generated: `dist` for the compiled app, and 
`node_modules`, for installed node packages. I've excluded the test
directories because I haven't written any tests. ;)


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

