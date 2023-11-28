import Hidemyacc from "./helpers/hidemyacc.js";
import puppeteer from "puppeteer-core";
import delay from "./helpers/delay.js";
// import likeFacebook from "./functions/facebook/likeFacebook.js";
import unFollows from "./functions/facebook/unFollow.js";

const hideMyAcc = new Hidemyacc();
async function navigateToUrl(page, url) {
  try {
    await page.goto(url, {
      waitUntil: "networkidle2",
    });
  } catch (error) {
    throw new Error(`Error navigating to URL: ${url}. ${error.message}`);
  }
}

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
    let err = [];
    try {
      const url = "https://www.facebook.com/";
      await navigateToUrl(page, url);
      await unFollows(page,3)
    } catch (error) {
      err.push({
        error: "Error during share reels execution",
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
