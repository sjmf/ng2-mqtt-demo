import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MQTTService } from '../../services/mqtt';
import { TransportState } from "../../services/mqtt/transport.service";

/**
 * MQ connection status as a component
 */
@Component({
  selector: 'app-mq-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  public state: Observable<string>;

  constructor(private _mqService: MQTTService) { }

  ngOnInit() {
    console.log('Status init');
    this.state = this._mqService.state
      .map((state: number) => TransportState[state]);
  }

}
