import { StoryMapPage } from './app.po';

describe('story-map App', function() {
  let page: StoryMapPage;

  beforeEach(() => {
    page = new StoryMapPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
