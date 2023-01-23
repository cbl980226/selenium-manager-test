const { Browser, By } = require("selenium-webdriver");
const ie = require("selenium-webdriver/ie");
const { driverLocation } = require("./selenium-manager");

(async () => {
  const IEDRIVER_EXE = driverLocation(Browser.INTERNET_EXPLORER);
  const service = new ie.ServiceBuilder(IEDRIVER_EXE).build();
  const options = new ie.Options();
  const driver = ie.Driver.createSession(options, service);

  // Throw an error here
  // const driver = await new Builder().forBrowser(Browser.INTERNET_EXPLORER).build();

  await driver.get("https://www.selenium.dev/selenium/web/web-form.html");
  const textBox = await driver.findElement(By.name("my-text"));
  const submitButton = await driver.findElement(By.css("button"));

  await textBox.sendKeys("Selenium");
  await submitButton.click();
  await driver.quit();
})();
