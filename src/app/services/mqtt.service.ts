import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Rx'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Config } from './config';
import { TransportService, TransportState } from './transport.service';

import 'mqtt';
import { Client, Packet, connect } from 'mqtt';
import { ClientOptions } from 'mqtt';

/** look up states for the message queue */
export const StateLookup: string[] = [
    "CLOSED",
    "TRYING",
    "CONNECTED",
    "SUBSCRIBED",
    "DISCONNECTING"
];

/**
 * Angular2 Message Queue Service using MQTT.js
 *
 * @description This service handles subscribing to a
 * message queue using the mqtt library, and returns
 * values via the ES6 Observable specification for
 * asynchronous value streaming by wiring messages 
 * into a Subject observable.
 */
@Injectable()
export class MQService implements TransportService {

    /* Service parameters */

    // State of the MQService
    public state: BehaviorSubject<TransportState>;

    // Publishes new messages to Observers
    public messages: Subject<Packet>;

    // Configuration structure with MQ creds
    private config: Config;

    // MQTT Client from MQTT.js
    private client: Client;

    // Resolve Promise made to calling class, when connected
    private resolvePromise: { (...args: any[]): void };

    /** Constructor */
    public constructor() {
        this.messages = new Subject<Packet>();
        this.state = new BehaviorSubject<TransportState>(TransportState.CLOSED);
    }


    /** Set up configuration */
    public configure(config?: Config): void {

        // Check for errors:
        if (this.state.getValue() != TransportState.CLOSED)
            throw Error("Already running!");
        if (config === null && this.config === null)
            throw Error("No configuration provided!");
        
        // Set our configuration
        if(config != null)
            this.config = config;

        // If host isn't set, use the browser's location
        if( typeof(this.config.host) === 'undefined')
            this.config.host = document.location.hostname;
    }


    /** 
     * Perform connection to broker, returning a Promise
     * which is resolved when connected. 
     */
    public try_connect(): Promise<{}> {

        if(this.state.getValue() != TransportState.CLOSED)
            throw Error("Can't try_connect if not CLOSED!");
        if(this.client === null)
            throw Error("Client not configured!");

        // Connecting via SSL Websocket?
        var scheme: string = 'ws';
        if (this.config.ssl) scheme = 'wss';

        // Client options loaded from config
        var options: ClientOptions = {
            'keepalive' : this.config.keepalive,
            'clientId' : 'clientid_' + Math.floor(Math.random()*65535),
            'username': this.config.user,
            'password': this.config.pass
        }
        var url = scheme + '://' + this.config.host + ':' + this.config.port;

        // Create the client and listen for its connection
        this.client = connect(url, options);

        this.client.addListener('connect', this.on_connect);
        this.client.addListener('reconnect', this.on_connect);
        this.client.addListener('message', this.on_message);
        this.client.addListener('offline', this.on_error);
        this.client.addListener('error', this.on_error);

        console.log("connecting to " + url);
        this.state.next(TransportState.TRYING);

        return new Promise(
            (resolve, reject) => this.resolvePromise = resolve
        );
    }


    /** Disconnect the client and clean up */
    public disconnect(message?: string): void {

        // Notify observers that we are disconnecting!
        this.state.next( TransportState.DISCONNECTING );

        // Disconnect. Callback will set CLOSED state
        this.client.end(
            false,
            () => this.state.next( TransportState.CLOSED )
        );
    }


    /** Send a message to all topics */
    public publish(message: string, topics?: [string]) {

        for (var t of this.config.publish)
            this.client.publish(t, message);
    }


    /** Subscribe to server message queues */
    public subscribe(): void {

        // Subscribe to our configured queues
        // Callback is set at client instantiation (assuming we don't need separate callbacks per queue.)
        for (var t of this.config.subscribe) {
            console.log("subscribing: " + t);
            this.client.subscribe(t);
        }
        // Update the state
        if (this.config.subscribe.length > 0)
            this.state.next( TransportState.SUBSCRIBED );
    }


    /** 
     * Callback Functions
     *
     * Note the method signature: () => preserves lexical scope
     * if we need to use this.x inside the function
     */
    public debug(...args: any[]) {

        // Push arguments to this function into console.log
        if (window.console && console.log && console.log.apply) {
            console.log.apply(console, args);
        }
    }


    // Callback run on successfully connecting to server
    public on_connect = () => {

        console.log("connected");

        // Indicate our connected state to observers
        this.state.next( TransportState.CONNECTED );

        // Subscribe to message queues
        this.subscribe();

        // Resolve our Promise to the caller
        this.resolvePromise();

        // Clear callback
        this.resolvePromise = null;
    }


    // Handle errors
    public on_error = (error: any) => {

        console.error("error handler called");
        console.error(error);

        // Check for dropped connection and try reconnecting
        if (error.indexOf("Lost connection") != -1) {

            // Reset state indicator
            this.state.next( TransportState.CLOSED );

            // // Attempt reconnection
            // console.log("Reconnecting in 5 seconds...");
            // setTimeout(() => {
            //     this.configure();
            //     this.try_connect();
            // }, 5000);
        }
    }


    // On message RX, notify the Observable with the message object
    public on_message = (...args: any[]) => {

        var topic = args[0],
            message = args[1],
            packet: Packet = args[2]

        // Log it to the console
        console.log(topic);
        console.log(message);
        //console.log(packet.messageId);

        if (message.toString()) {
            this.messages.next(message);
        } else {
            console.warn("Empty message received!");
        }
    }
}
