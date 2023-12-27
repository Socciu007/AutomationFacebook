import scrollSmoothIfNotExistOnScreen from "../../helpers/scrollIfNotExist.js";
import checkExistElementOnScreen from "../../helpers/checkElementOnScreen.js";
import {
  delay,
  getElement,
  getElements,
  getRandomInt,
  getRandomIntBetween,
  waitForNavigation
} from "../../helpers/puppeteer.js";
import checkExistElement from "../../helpers/checkExistElement.js";

async function cancelFriend(page, cancelFriend) {
  let numCancel = getRandomIntBetween(
    cancelFriend.numRequestStart,
    cancelFriend.numRequestEnd
  );
  let count = 0;
  let randomDelay = getRandomIntBetween(
    cancelFriend.delayTimeStart * 1000,
    cancelFriend.delayTimeEnd * 1000
  );

  if (cancelFriend.selectedOption == "cancelRequest") {
    while (count < numCancel) {
      try {
        await delay(randomDelay);
        const rs = await cancelFriendOnRequest(page, cancelFriend);
        if (rs > 0) {
          count++;
        }
      } catch (error) {
        console.log(error);
        break;
      }
    }
  }
  if (cancelFriend.selectedOption == "unfriend") {
    let count = 0;
    await delay(randomDelay);
    await clickHomePage(page);
    await delay(randomDelay);
    await clickFriend(page);
    await delay(randomDelay);
    if (cancelFriend.unfriendOption == "random") {
      while (count < numCancel) {
        await chooseOneFriend(page);
        await delay(randomDelay);
        await clickMore(page);
        await delay(randomDelay);
        await clickCancel(page);
        await delay(randomDelay);
        await confirm(page);
        await delay(randomDelay);
        count++;
        await page.goto("https://mbasic.facebook.com/profile.php?v=friends");
        await delay(randomDelay);
      }
    }
    if (cancelFriend.unfriendOption == "UID") {
      while (count < numCancel) {
        await chooseOneFriend(page);
        await delay(randomDelay);
        await clickMore(page);
        await delay(randomDelay);
        await clickCancel(page);
        await delay(randomDelay);
        await confirm(page);
        await delay(randomDelay);
        count++;
        await page.goto("https://mbasic.facebook.com/profile.php?v=friends");
        await delay(randomDelay);
      }
    }
  }
}
async function cancelFriendOnRequest(page, cancelFriend) {
  try {
    let hrefs = await page.$$eval("a", (links) => links.map((a) => a.href));
    if (hrefs.length > 0) {
      hrefs = hrefs.filter((e) => e.includes("/a/notifications.php?delete"));
      const randomIndex = getRandomInt(hrefs.length);
      const href = hrefs[randomIndex];
      const deleteSelector = `[href="${href.replace(
        "https://mbasic.facebook.com",
        ""
      )}"]`;
      const checkDeleteBtn = await checkExistElement(page, deleteSelector, 3);
      if (checkDeleteBtn != 1) {
        throw new Error("Can't find delete button");
      }
      await scrollSmoothIfNotExistOnScreen(page, deleteSelector);
      const deleteBtn = await getElement(page, deleteSelector);
      if (deleteBtn) {
        await deleteBtn.click();
      }
      let randomDelay = getRandomIntBetween(
        cancelFriend.delayTimeStart * 1000,
        cancelFriend.delayTimeEnd * 1000
      );
      await delay(randomDelay);
      const homeSelector = "#header > nav > a:nth-child(1)";
      const checkHomeBtn = await checkExistElement(page, homeSelector, 3);
      if (checkHomeBtn != 1) {
        throw new Error("Can't find home button");
      }
      await scrollSmoothIfNotExistOnScreen(page, homeSelector);
      const homeBtn = await getElement(page, homeSelector);
      if (homeBtn) {
        await homeBtn.click();
      }
      return 1;
    }
  } catch (error) {
    console.log(error);
  }
}
async function clickHomePage(page) {
  try {
    const homePageSelector = "#header > nav > a:nth-child(2)";
    const checkHomePageBtn = await checkExistElement(page, homePageSelector, 3);
    if (checkHomePageBtn != 1) {
      throw new Error("Can't find home button");
    }
    await scrollSmoothIfNotExistOnScreen(page, homePageSelector);
    const homePageBtn = await getElement(page, homePageSelector);
    if (homePageBtn) {
      await homePageBtn.click();
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function clickFriend(page) {
  try {
    let hrefs = await page.$$eval("a", (links) => links.map((a) => a.href));
    if (hrefs.length > 0) {
      hrefs = hrefs.filter((e) => e.includes("/profile.php?v=friends"));
      const randomIndex = getRandomInt(hrefs.length);
      const href = hrefs[randomIndex];
      const friendSelector = `[href="${href.replace(
        "https://mbasic.facebook.com",
        ""
      )}"]`;
      const checkFriendBtn = await checkExistElement(page, friendSelector, 3);
      if (checkFriendBtn != 1) {
        throw new Error("Can't find delete button");
      }
      await scrollSmoothIfNotExistOnScreen(page, friendSelector);
      const friendBtn = await getElement(page, friendSelector);
      if (friendBtn) {
        await friendBtn.click();
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function chooseOneFriend(page) {
  try {
    const listFriendSelector =
      "#root > div > div > div > div > div> table > tbody > tr > td > a";
    const friends = await getElements(page, listFriendSelector, 10);
    if (friends.length > 0) {
      const randomIndex = getRandomInt(friends.length);
      let href = await page.evaluate((el) => {
        return el.getAttribute("href");
      }, friends[randomIndex]);
      const selector = `[href="${href}"]`;
      console.log(selector);
      const check = await checkExistElement(page, selector, 3);
      if (check != 1) {
        throw new Error("Can't find friend button");
      }
      await scrollSmoothIfNotExistOnScreen(page, selector);
      const friendBtn = await getElement(page, selector);
      if (friendBtn) {
        await friendBtn.click();
      }
    } else {
      console.log("sai");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function clickMore(page) {
  try {
    let moreSelector =
      "#m-timeline-cover-section > div > table > tbody > tr > td:nth-child(2) > a";
    const check = await checkExistElement(page, moreSelector, 3);
    console.log(check);
    if (check != 1) {
      throw new Error("Can't find friend button");
    }
    await scrollSmoothIfNotExistOnScreen(page, moreSelector);
    const moreBtn = await getElement(page, moreSelector);
    if (moreBtn) {
      await moreBtn.click();
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function clickCancel(page) {
  try {
    let cancelSelector =
      "#root > table > tbody > tr > td > section > ul > li:nth-child(1) > a";
    const check = await checkExistElement(page, cancelSelector, 3);
    console.log(check);
    if (check != 1) {
      throw new Error("Can't find cancel button");
    }
    const cancelBtn = await getElement(page, cancelSelector);
    if (!cancelBtn) {
      console.log("Fail");
    }
    await scrollSmoothIfNotExistOnScreen(page, cancelSelector);
    await cancelBtn.click();
    console.log("click");
    await delay(5000);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function confirm(page) {
  try {
    let confirmSelector = 'input[name="confirm"]';
    const check = await checkExistElement(page, confirmSelector, 3);
    console.log(check);
    if (check != 1) {
      throw new Error("Can't find confirm button");
    }
    await scrollSmoothIfNotExistOnScreen(page, confirmSelector);
    const confirmBtn = await getElement(page, confirmSelector);
    if (confirmBtn) {
      await confirmBtn.click();
    }
    await delay(5000);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export default cancelFriend;
