import Hidemyacc from "./helpers/hidemyacc.js";
import puppeteer from "puppeteer-core";
import delay from "./helpers/delay.js";
import addFriend from "./functions/facebook/addFriend.js";


const hideMyAcc = new Hidemyacc();

(async () => {
  const profiles = await hideMyAcc.profiles();
  // console.log(profiles);
  try {
    const tabPromises = profiles.data.map(async (profile) => {
    const response = await hideMyAcc.start(profile.id);
    if (!response) {
      throw new Error(
        "Received a null or undefined response when starting a profile."
      );
    }
    const browser = await puppeteer.connect({
      browserWSEndpoint: response.data.wsUrl,
      defaultViewport: null,
      slowMo: 60,
    });
    const page = await browser.newPage();
    await delay(1000);
    await page.goto("https://www.facebook.com/", {
      waitUntil: "networkidle2",
    });

    await addFriend(page,3)
  });
  const openedTabs = await Promise.all(tabPromises);
  // await Promise.all(openedTabs.map(async (tab) => tab.browser.close()));
  } catch (error) {
    hideMyAcc.stop();
  }
  
})();
