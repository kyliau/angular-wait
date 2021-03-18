import 'jasmine';
import * as path from 'path';
import { Builder, By, WebDriver } from 'selenium-webdriver';
import { waitForAngular } from '../server/server';
import { Options, ServiceBuilder } from 'selenium-webdriver/chrome';

describe('wait for Angular', () => {
  let wd: WebDriver;

  beforeAll(async () => {
    wd = await new Builder()
      .forBrowser('chrome')
      // For local development only
      // .setChromeService(new ServiceBuilder(path.join(__dirname, 'chromedriver')))
      .setChromeOptions(
        new Options()
          .headless()
      )
      .build();
  });

  it('works', async () => {
    await wd.get('http://localhost:4200');
    const didWork = await waitForAngular(wd);
    // In this case no work is done because the app is already stable
    expect(didWork).toEqual([false]);
    const elem = await wd.findElement(By.css('app-root'));
    expect(await elem.getText()).toMatch('Welcome to project!');
  });

})