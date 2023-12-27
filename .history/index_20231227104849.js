import Hidemyacc from "./helpers/hidemyacc.js";
import puppeteer from "puppeteer-core";
import delay from "./helpers/delay.js";
import checkIsLive from "./helpers/checkIsLive.js";
import interactWithNewsfeed from "./functions/mbasic/newsfeed.js";
import cancelFriend from "./functions/mbasic/cancelFriend.js";
const hideMyAcc = new Hidemyacc();
async function navigateToUrl(page, link) {
  try {
    const url = await page.url();
    if (!url.includes(link)) {
      await page.goto(link, {
        waitUntil: "networkidle2"
      });
    } else {
      console.log("cant navigate");
    }
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
        slowMo: 60
      });
      await delay(1000);
      // console.log(err)
      const page = await browser.newPage();
      const bool = await checkIsLive(page);
      if (bool == true) {
        const url = "https://mbasic.facebook.com/";
        await navigateToUrl(page, url);
        await delay(5000);
        let cancelFriendObj = {
          selectedOption: "unfriend", // cancelRequest
          numRequestStart: 2,
          numRequestEnd: 4,
          delayTimeStart: 3,
          delayTimeEnd: 5,
          unfriendOption: "random,UID",
          listUID: []
        };
        await cancelFriend(page, cancelFriendObj);
      } else {
        console.log("page crashed");
      }
    });
    const openedTabs = await Promise.all(tabPromises);
    // await Promise.all(openedTabs.map(async (tab) => tab.browser.close()));
  } catch (error) {
    hideMyAcc.stop();
  }
})();
