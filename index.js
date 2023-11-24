import Hidemyacc from "./helpers/hidemyacc.js";
import puppeteer from "puppeteer-core";
import delay from "./helpers/delay.js";
// import likeFacebook from "./functions/facebook/likeFacebook.js";

import saveReels from "./functions/reels/saveReels.js";
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
    let err = [];
    try {
      await saveReels(page, 3, 1, 3);
      await delay(10000);
    } catch (error) {
      err.push({
        error: "Error during save reels execution",
        detail: error.message
      })
    }
    console.log(err)
  });
  const openedTabs = await Promise.all(tabPromises);
  // await Promise.all(openedTabs.map(async (tab) => tab.browser.close()));
  } catch (error) {
    hideMyAcc.stop();
  }
  
})();
