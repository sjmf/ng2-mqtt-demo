import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { RawDataComponent } from "./rawdata/rawdata.component";
import { StatusComponent } from "./status/status.component";
import { ReversePipe } from "./pipes/reverse.pipe";

@NgModule({
  declarations: [
    AppComponent,
    RawDataComponent,
    StatusComponent,
    ReversePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
