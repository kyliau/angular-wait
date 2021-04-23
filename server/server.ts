import type { WebDriver } from 'selenium-webdriver';

declare namespace window {
  // See actual implementation at
  // https://github.com/angular/angular/blob/655507012b7b59c83e27429349ce3ac10608a82d/packages/platform-browser/src/browser/testability.ts#L30
  interface FrameworkStabilizer {
    (callback: (didWork: boolean) => void): void;
  }
  const frameworkStabilizers: FrameworkStabilizer[];
}

/**
 * This function is meant to be executed in the browser.
 * It taps into the hooks exposed by Angular and invokes the specified
 * `callback` when the application is stable (no more pending tasks).
 */
function whenStable(callback: (didWork: boolean[]) => void): void {
  const promises = window.frameworkStabilizers.map(stabilizer => {
    return new Promise<boolean>(resolve => {
      // Stabilizer will invoke the `resolve` function with a boolean to
      // indicate whether any work is done.
      stabilizer(resolve);
    });
  });
  Promise.all(promises).then(callback);
}

function whenBootstrapped(): boolean {
  return Array.isArray(window.frameworkStabilizers);
}

/**
 * This function is meant to be executed on the server (Node.js).
 * It returns a promise that resolves when the application is "stable".
 * The promise might be rejected due to timeouts, or async tasks in the client
 * app that never finish (timers, etc).
 * @param wd WebDriver instance
 */
export async function waitForAngular(wd: WebDriver): Promise<boolean[]> {
  await wd.wait(() => wd.executeScript(whenBootstrapped));
  return wd.executeAsyncScript(whenStable);
}
