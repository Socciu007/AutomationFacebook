import Hidemyacc from "./hidemyacc.js";
import puppeteer from "puppeteer-core";
import delay from "./delay.js";
const hideMyAcc = new Hidemyacc();

async function likeFacebook(page) {
  let liked = false;
  // Keep trying to find the like button
  while (!liked) {
    try {
      const likeButton = await page.$(
        'span[class= "x3nfvp2"] > i[data-visualcompletion="css-img"]'
      );
      if (likeButton) {
        // Click the like button if found
        console.log("Like button found. Clicking...");
        await likeButton.click();
        await delay(3000);
        liked = true;
      } else {
        // If like button is not found, scroll down
        console.log("Like button not found, scrolling...");
        await page.mouse.wheel({ deltaY: 500 });
        await delay(2000);
      }
    } catch (error) {
      console.log("An error occurred:", error);
      await delay(2000);
    }
  }

  if (liked) {
    console.log("Post liked!");
  }
}
async function commentFacebook(page) {
  let cmtArea = false;
  while (!cmtArea) {
    try {
      const commentButton = await page.$('div[aria-label="Viết bình luận"]');
      if (commentButton) {
        // in case comment field does not show up
        await commentButton.click();
        await delay(2000);
        await page.keyboard.type("..................");
        await page.keyboard.press("Enter");
        cmtArea = true;
      } else {
        console.log("Không tìm thấy trường nhập bình luận. Tiếp tục scroll");
        await page.mouse.wheel({ deltaY: 500 });
        await delay(2000);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
async function readContent(page) {
  // Read content
  let postContent = "";
  // Keep trying to read the content
  while (!postContent) {
    try {
      postContent = await page.$eval(
        'div[data-ad-preview="message"]',
        (el) => el.innerText
      );

      // If content is found, break out of the loop
      if (postContent) {
        console.log(postContent);
        break;
      }
    } catch (error) {
      // If element is not found, catch the error and continue scrolling
      console.log("Content not found, scrolling...");
      await page.mouse.wheel({ deltaY: 300 });
      await delay(2000); // wait for 2 seconds before trying again
    }
  }
}
(async () => {
  const profiles = await hideMyAcc.profiles();
  // console.log(profiles);
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
    await readContent(page);
    await delay(3000);
    await likeFacebook(page);
    await delay(3000);
    await commentFacebook(page);
    await delay(3000);
  });
  const openedTabs = await Promise.all(tabPromises);

})();
