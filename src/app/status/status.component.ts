import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MQService, StateLookup } from '../services/mqtt.service';

/**
 * MQ connection status as a component
 */
@Component({
  selector: 'mq-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  private state: Observable<string>;

  constructor(private _mqService: MQService) { }

  ngOnInit() {
    console.log("Status init");
    this.state = this._mqService.state
      .map( (state:number) => StateLookup[state] );
  }

}
