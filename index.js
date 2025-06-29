const {Builder, Browser, By} = require('selenium-webdriver');

async function helloSelenium(driver) {
  

  await driver.get('https://www.karlsruhe.de/stadt-rathaus/service-buergerinformation/terminvereinbarung');
  await driver.findElement(By.linkText('Termin Ausländerbehörde')).click();

  const browserTabs = await driver.getAllWindowHandles();
  // assert.strictEqual(browserTabs.length, 2);

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
  
  for (let a of appointments) {
    let date = await a.getAttribute('id');
    console.log(date);
  }
}


function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function lookappo(tminSecs, tmaxSecs) {
  
  while(true) {
    let driver = await new Builder().forBrowser(Browser.CHROME).build();
    try {
      console.log(new Date())
      await helloSelenium(driver);
      let time = Math.floor(Math.random()*(tmaxSecs - tminSecs) + tminSecs)*1000;
      await sleep(time);
      console.log(time);
    } catch ({ name, message }) {
      console.log(name);
      console.log(message);
    }
    console.log("closing browser...")
    await driver.quit();
  }
}

lookappo(70, 100);