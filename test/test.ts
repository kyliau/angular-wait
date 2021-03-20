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

  afterAll(async () => {
    await wd.quit();
  });

  it('works', async () => {
    await wd.get('http://localhost:4200');
    const didWork = await waitForAngular(wd);
    // In this case no work is done because the app is already stable
    expect(didWork).toEqual([false]);
    const root = await wd.findElement(By.css('app-root'));
    expect(await root.getText()).toMatch('Welcome to project!');
    const button = await wd.findElement(By.id('my-button'));
    await button.click();
    const didWork2 = await waitForAngular(wd);
    // Button updates project name after 250ms delay
    expect(didWork2).toEqual([true]);
    expect(await root.getText()).toMatch('Welcome to demo project!');
  });

})