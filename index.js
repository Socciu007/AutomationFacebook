import Hidemyacc from "./helpers/hidemyacc.js";
import puppeteer from "puppeteer-core";
import delay from "./helpers/delay.js";
import readContent from "./functions/readContent.js";
import commentFacebook from "./functions/cmtFacebook.js";
import likeFacebook from "./functions/likeFacebook.js";
import shareFacebook from "./functions/shareFacebook.js";
import upPost from "./functions/upPosts.js";

import reactReels from "./testHideMyAcc/reactReels.js";
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
    await page.goto("https://www.facebook.com/reel/", {
      waitUntil: "networkidle2",
    });
    // await readContent(page,2,4);
    // await delay(3000);
    // await likeFacebook(page,3);
    // await delay(3000);
    // await commentFacebook(page,3);
    // await delay(3000);
    // await shareFacebook(page,2);
    // await delay(2000)
    // await upPost(page);
    // return {browser, page}
    // await testShare(page, 2, 1, 3);
    await reactReels(page,3,1,3)
  });
  const openedTabs = await Promise.all(tabPromises);
  // await Promise.all(openedTabs.map(async (tab) => tab.browser.close()));
  } catch (error) {
    hideMyAcc.stop();
  }
  
})();
