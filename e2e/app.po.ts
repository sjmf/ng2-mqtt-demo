import { browser, element, by } from 'protractor';

export class Ng2MQTTDemoPage {
  navigateTo() {
    return browser.get('/');
  }

  getHeaderText() {
    return element(by.css('app-root h1')).getText();
  }
}
