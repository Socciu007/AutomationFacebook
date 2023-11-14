import Hidemyacc from "./hidemyacc.js";
import puppeteer from "puppeteer-core";
import delay from "./delay.js";
import readContent from "./readContent.js";
import commentFacebook from "./cmtFacebook.js";
import likeFacebook from "./likeFacebook.js";
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
    // await readContent(page);
    // await delay(3000);
    // await likeFacebook(page,3);
    // await delay(3000);
    await commentFacebook(page,3);
    await delay(3000);
    return {browser, page}
  });
  const openedTabs = await Promise.all(tabPromises);
  // await Promise.all(openedTabs.map(async (tab) => tab.browser.close()));
  } catch (error) {
    hideMyAcc.stop();
  }
  
})();
