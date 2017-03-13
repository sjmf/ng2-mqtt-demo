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
export abstract class TransportService {

  // State of the TransportService implementer
  abstract state: BehaviorSubject<TransportState>;

  // Publishes new messages to Observers
  abstract messages: Subject<Object>;

  /** Callback run on successfully connecting to server */
  abstract on_connect: () => void;

  /** On message RX, notify the Observable with the message object */
  abstract on_message: (...args: any[]) => void;

  /** Handle errors */
  abstract on_error: (error: any) => void;

  /** Set up configuration */
  abstract configure(config?: Config): void;

  /** Perform connection to broker, returning a Promise resolved when connected */
  abstract try_connect(): Promise<{}>;

  /** Disconnect the client and clean up */
  abstract disconnect(): void;

  /** Send a message to all topics, or just those in the array */
  abstract publish(message?: string): void;

  /** Subscribe to server message queues */
  abstract subscribe(): void;
}
