import { Ng2MQTTDemoPage } from './app.po';

describe('ng2-mqtt-demo App', function() {
  let page: Ng2MQTTDemoPage;

  beforeEach(() => {
    page = new Ng2MQTTDemoPage();
  });

  it('should display message saying \'Angular 2 Message Queue Demo\'', () => {
    page.navigateTo();
    expect(page.getHeaderText()).toEqual('Angular 2 Message Queue Demo');
  });
});
