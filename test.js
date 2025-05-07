require("dotenv").config();
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");

const EMAIL = process.env.INTERVUE_EMAIL;
const PASSWORD = process.env.INTERVUE_PASSWORD;

async function waitAndClick(driver, locator, timeout = 20000) {
  const el = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(el), timeout);
  await driver.wait(until.elementIsEnabled(el), timeout);
  await el.click();
}

async function runTest() {
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(
      new chrome.Options().addArguments(
        "--headless",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--window-size=1920,1080"
      )
    )
    .build();

  try {
    console.log("🔗 Navigating to homepage...");
    await driver.get("https://www.intervue.io");

    console.log("🕒 Waiting for top-right 'Login' button...");
    await waitAndClick(driver, By.xpath("//a[text()='Login']"));

    console.log("🕒 Waiting for 'For Companies' login option...");
    await waitAndClick(
      driver,
      By.xpath("//h2[contains(text(), 'For Companies')]/following::button[1]")
    );

    console.log("🔑 Entering credentials...");
    await driver.wait(until.elementLocated(By.name("email")), 10000);
    await driver.findElement(By.name("email")).sendKeys(EMAIL);
    await driver.findElement(By.name("password")).sendKeys(PASSWORD);
    await waitAndClick(driver, By.xpath("//button[contains(text(),'Login')]"));

    console.log("📊 Waiting for dashboard...");
    await driver.wait(until.elementLocated(By.css("input[placeholder='Search']")), 15000);

    console.log("🔍 Performing a dashboard search...");
    const searchBox = await driver.findElement(By.css("input[placeholder='Search']"));
    await searchBox.sendKeys("Test Candidate");

    console.log("📸 Taking screenshot...");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    fs.writeFileSync(`screenshot-${timestamp}.png`, await driver.takeScreenshot(), "base64");

    console.log("🚪 Logging out...");
    await waitAndClick(driver, By.css("button[aria-label='Account settings']"));
    await waitAndClick(driver, By.xpath("//li[contains(text(), 'Logout')]"));

    console.log("✅ Logged out, test completed.");
  } catch (err) {
    console.error("❌ Test failed:", err);
  } finally {
    await driver.quit();
  }
}

runTest();
