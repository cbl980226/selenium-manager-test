/**
 *  @link https://github.com/SeleniumHQ/selenium/blob/trunk/javascript/node/selenium-webdriver/common/seleniumManager.js
 *
 *  This implementation is still in beta, and may change.
 *
 *  Wrapper for getting information from the Selenium Manager binaries
 */

const { platform } = require("process");
const path = require("path");
const fs = require("fs");
const execSync = require("child_process").execSync;
const { Browser } = require("selenium-webdriver");

/**
 * currently supported browsers for selenium-manager
 * @type {object}
 */
const BrowserMap = {
  [Browser.CHROME]: "chrome",
  [Browser.EDGE]: "edge",
  [Browser.FIREFOX]: "firefox",
  [Browser.INTERNET_EXPLORER]: "iexplorer",
};

/**
 * Determines the path of the correct Selenium Manager binary
 * @returns {string}
 */
function getBinary() {
  const directory = {
    darwin: "macos",
    win32: "windows",
    cygwin: "windows",
    linux: "linux",
  }[platform];

  const file =
    directory === "windows" ? "selenium-manager.exe" : "selenium-manager";
  const seleniumWebdriver = path.dirname(require.resolve("selenium-webdriver"));
  const filePath = path.join(seleniumWebdriver, "/bin", directory, file);

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Unable to obtain Selenium Manager, 请确保selenium-webdriver的版本大于4.6.0, e.g. \`npm upgrade selenium-webdriver@latest\``
    );
  }

  return filePath;
}

/**
 * Determines the path of the correct driver
 * @param {Browser|string} browserName name to fetch the driver
 * @param {string|number} [browserVersion] version of the browser
 * @returns {string} path of the driver location
 */
function driverLocation(browserName, browserVersion) {
  const browser = BrowserMap[browserName];
  if (!browser) {
    throw new Error(
      `Unable to locate driver associated with browser name: ${browser}, Allowed browsers name: ${Object.keys(
        BrowserMap
      )}`
    );
  }

  let args = [getBinary(), "--browser", browser];
  let result;

  if (browserVersion) {
    args.push("--browser-version", browserVersion);
  }

  try {
    result = execSync(args.join(" ")).toString();
  } catch (e) {
    throw new Error(
      `Error executing command with ${args}\n${e.stdout.toString()}${e.stderr.toString()}`
    );
  }

  if (!result.startsWith("INFO\t")) {
    throw new Error(`Unsuccessful command executed: ${args}\n${result}`);
  }

  return result.replace("INFO\t", "").trim();
}

// PUBLIC API
module.exports = {
  driverLocation,
};
