import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Packet } from 'mqtt';

import { MQTTService } from '../../services/mqtt';
import { ConfigService } from '../../services/config/config.service';

/**
 * This component is an example implementation which uses
 *  the Service to subscribe to data from a queue,
 *  then pass that into Angular2 template variables.
 *
 *  The Service makes available an Observable which
 *  this component uses in its own template, and
 *  additionally subscribes its' own on_next method to.
 *
 *  The instantiating component must provide an instance
 *  of Service.
 */
@Component({
  selector: 'app-rawdata',
  templateUrl: './rawdata.component.html',
  styleUrls: ['./rawdata.component.css'],
  providers: [MQTTService, ConfigService]
})
export class RawDataComponent implements OnInit, OnDestroy {

  // Stream of messages
  public messages: Observable<Packet>;

  // Array of historic message (bodies)
  public mq: Array<string> = [];

  // A count of messages received
  public count = 0;

  /** Constructor */
  constructor(private _mqService: MQTTService,
    private _configService: ConfigService) { }

  ngOnInit() {
    // Get configuration from config service...
    this._configService.getConfig('api/config.json').then(
      config => {
        // ... then pass it to (and connect) the message queue:
        this._mqService.configure(config);
        this._mqService.try_connect()
          .then(this.on_connect)
          .catch(this.on_error);
      }
    );
  }

  ngOnDestroy() {
    this._mqService.disconnect();
  }

  /** Callback on_connect to queue */
  public on_connect = () => {

    // Store local reference to Observable
    // for use with template ( | async )
    this.messages = this._mqService.messages;

    // Subscribe a function to be run on_next message
    this.messages.subscribe(this.on_next);
  }

  /** Consume a message from the _mqService */
  public on_next = (message: Packet) => {

    // Store message in "historic messages" queue
    this.mq.push(message.toString() + '\n');

    // Count it
    this.count++;
  }

  public on_error = () => {
    console.error('Ooops, error in RawDataComponent');
  }
}
