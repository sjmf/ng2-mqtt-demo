import { Ui2Page } from './app.po';

describe('ui2 App', function() {
  let page: Ui2Page;

  beforeEach(() => {
    page = new Ui2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
