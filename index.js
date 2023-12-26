import Hidemyacc from "./helpers/hidemyacc.js";
import puppeteer from "puppeteer-core";
import delay from "./helpers/delay.js";
import checkExistElementOnScreen from "./helpers/checkElementOnScreen.js";
import checkIsLive from "./helpers/checkIsLive.js";
import scrollSmoothIfNotExistOnScreen from "./helpers/scrollIfNotExist.js";
import checkExistElement from "./helpers/checkExistElement.js";
import clearText from "./helpers/clearText.js";
import getSizeChrome from "./helpers/getChromeSize.js";
import likeRandom from "./functions/mbasic/likeRandom.js";
import readNotifications from "./functions/mbasic/readNotifications.js";
import sendMessage from "./functions/mbasic/sendMessage.js";
import replyMessage from "./functions/mbasic/replyMessage.js";
const hideMyAcc = new Hidemyacc();
async function navigateToUrl(page, link) {
  try {
    const url = await page.url();
    if (!url.includes(link)) {
      await page.goto(link, {
        waitUntil: "networkidle2",
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
    const tabPromises = profiles.data.map(async profile => {
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
      await delay(1000);
      // console.log(err)
      const page = await browser.newPage();
      const bool = await checkIsLive(page);
      if (bool == true) {
        const url = "https://mbasic.facebook.com/";
        await navigateToUrl(page, url);
        await delay(5000);
        // const rs = await likeRandom(page, 3, 2, 3);
        // const readNoti = await readNotifications(page, profiles.data.length);
        const sendMsg = await sendMessage(page, profiles.data.length);
        // const replyMsg = await replyMessage(page, profiles.data.length);
        // const JSpath = "#m_news_feed_stream > a";
        // const result = await checkExistElementOnScreen(page, JSpath);
        // switch (result) {
        //   case 1:
        //     await page.click(JSpath);
        //     console.log("clicked");
        //     break;
        //   case -1:
        //     const rs = await scrollSmoothIfNotExistOnScreen(page, JSpath);
        //     if (rs == 1) {
        //       console.log("scrolled");
        //       await page.click(JSpath);
        //     } else {
        //       console.log("can't scroll");
        //     }
        //     break;
        //   case false:
        //     console.log("Error when check exist element");
        // }
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
