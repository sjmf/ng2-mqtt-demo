import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MQTTService, StateLookup } from '../../services/mqtt';

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
      .map((state: number) => StateLookup[state]);
  }

}
