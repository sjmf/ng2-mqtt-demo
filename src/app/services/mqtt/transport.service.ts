import { Subject } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Config } from '../config';


/** possible states for the message queue */
export enum TransportState {
  CLOSED,
  TRYING,
  CONNECTED,
  SUBSCRIBED,
  DISCONNECTING
}

/* Interface which MQ Transports must implement */
export interface TransportService {

  // State of the TransportService implementer
  state: BehaviorSubject<TransportState>;

  // Publishes new messages to Observers
  messages: Subject<Object>;

  /** Callback run on successfully connecting to server */
  on_connect: () => void;

  /** On message RX, notify the Observable with the message object */
  on_message: (...args: any[]) => void;

  /** Handle errors */
  on_error: (error: any) => void;

  /** Set up configuration */
  configure(config?: Config): void;

  /** Perform connection to broker, returning a Promise resolved when connected */
  try_connect(): Promise<{}>;

  /** Disconnect the client and clean up */
  disconnect(): void;

  /** Send a message to all topics, or just those in the array */
  publish(message?: string): void;

  /** Subscribe to server message queues */
  subscribe(): void;
}
