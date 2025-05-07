// test.js  (CommonJS‑friendly)
require('dotenv').config();                 // pulls .env

const {Builder, By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs     = require('node:fs/promises');

const wait  = {short: 5_000, long: 20_000};

async function clickable(driver, locator, timeout = wait.long) {
  const el = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(el),   timeout);
  await driver.wait(until.elementIsEnabled(el),   timeout);
  return el;
}

async function run() {
  const driver = await new Builder()
      .usingServer('http://selenium:4444/wd/hub')
      .forBrowser('chrome')
      .setChromeOptions(
        new chrome.Options()
          .addArguments('--headless=new',
                        '--no-sandbox',
                        '--disable-dev-shm-usage',
                        '--window-size=1920,1080'))
      .build();

  try {
    console.log('🔗  opening intervue.io');
    await driver.get('https://www.intervue.io');

    console.log('login');
    await (await clickable(driver, By.xpath("//a[normalize-space()='Login']"))).click();
    await (await clickable(driver,
        By.xpath("//h2[contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'for companies')]/following::button[1]"))).click();

    console.log('credentials');
    await (await clickable(driver, By.css("input[type='email']"), wait.short))
         .sendKeys(process.env.INTERVUE_EMAIL);
    await (await clickable(driver, By.css("input[type='password']"), wait.short))
         .sendKeys(process.env.INTERVUE_PASSWORD);
    await (await clickable(driver, By.xpath("//button[contains(.,'Login') or contains(.,'Sign in')]"))).click();

    console.log('search');
    const search = await clickable(driver, By.css("input[type='search']"));
    await search.sendKeys('automation demo\n');

    console.log('screenshot');
    const png = await driver.takeScreenshot();
    await fs.writeFile('screenshots/dashboard.png', png, 'base64');

    console.log('logout');
    await (await clickable(driver, By.css("[data-testid='profile-menu']"))).click();
    await (await clickable(driver, By.xpath("//span[normalize-space()='Logout']"))).click();

    console.log('✅  done');
  } finally {
    await driver.quit();
  }
}

run().catch(err => {
  console.error('❌  Test failed:', err);
  process.exitCode = 1;
});
