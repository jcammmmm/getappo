const {Builder, Browser, By} = require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');

async function getAppointmentDates(driver) {
  console.log(new Date())

  await driver.get('https://www.karlsruhe.de/stadt-rathaus/service-buergerinformation/terminvereinbarung');
  const cookieNotice = await driver.findElement(By.css('.cookie-notice'));
  console.log("ok")
  if (cookieNotice) {
    await cookieNotice.findElement(By.css('button')).click();
  }

  await driver.findElement(By.linkText('Termin Ausländerbehörde')).click();
  const browserTabs = await driver.getAllWindowHandles();
  await driver.switchTo().window(browserTabs[1]);

  // Abgabe biometrischer Daten nach Erhalt unserer Entscheidung
  await driver.findElement(By.xpath('//*[@id="sd_2b5c2344-0a6d-47f1-a6c4-6656b2b1adda"]/li/div/span[3]')).click();
  // eAT Bestellung bei neuem/geänderten Pass (Übertrag)
  await driver.findElement(By.xpath('//*[@id="sd_01eeeb8c-7a50-454c-b8e9-bed990ab7ced"]/li/div/span[3]')).click();

  // Move to appointment screen
  await driver.findElement(By.css('#forward-service')).click();

  // select appointment div
  const appoholder = await driver.findElement(By.xpath('//*[@id="appointment_holder"]'));
  // document.querySelector('//*[@id="appointment_holder"]');
  const appointments = await appoholder.findElements(By.css('a.smart-date'));
  
  let dates = [];
  for (let a of appointments) {
    let date = await a.getAttribute('id');
    dates.push(date);
  }
  return dates;
}


function sleep(tminSecs, tmaxSecs) {
  let time = Math.floor(Math.random()*(tmaxSecs - tminSecs) + tminSecs)*1000;
  console.log(time);
  return new Promise(resolve => setTimeout(resolve, time));
}

async function lookappo() {
  while(true) {
    const options = new Chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--window-size=1920,1080');
    // https://stackoverflow.com/questions/66612934/some-websites-dont-fully-load-render-in-selenium-headless-mode
    options.addArguments('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36');
    
    let driver = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(options)
      // .setChromeOptions(options)
      .build();
    try {
      let dates = await getAppointmentDates(driver);
      console.log(dates);
      await sleep(70, 100);
    } catch ({ name, message }) {
      console.log(name);
      console.log(message);
    }
    console.log("closing browser...")
    await driver.quit();
  }
}

lookappo();