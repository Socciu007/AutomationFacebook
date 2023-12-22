import checkExistElement from "../../helpers/checkExistElement.js";
import { delay } from "../../helpers/puppeteer.js";
import { getElement } from "../../helpers/puppeteer.js";
import getRandomInt from "../../helpers/randomInt.js";
import scrollSmoothIfNotExistOnScreen from "../../helpers/scrollIfNotExist.js";

async function readNotifications(page, numsNoti) {
  try {
    // tim nut thong bao và click sang trang thong bao
    let hrefsNoti = await page.$$eval("a", links => links.map(a => a.href));
    if (hrefsNoti.length > 0) {
      hrefsNoti = hrefsNoti.filter(e => e.includes("/notifications"));
      const href = hrefsNoti[0];
      const notiSelector = `[href="${href.replace(
        "https://mbasic.facebook.com",
        ""
      )}"]`;
      const checknotiBtn = await checkExistElement(page, notiSelector, 3);
      if (checknotiBtn != 1) {
        throw Error("Element notification is not exist");
      }
      await scrollSmoothIfNotExistOnScreen(page, notiSelector);
      const notiBtn = await getElement(page, notiSelector);
      if (notiBtn) {
        await notiBtn.click();
      } else {
        throw Error("Can not click into notification");
      }
    }
    await delay(getRandomInt(3000, 5000));
    // check sang trang notification ?
    let url = await page.url();
    if (!url.includes("/notifications")) {
      throw Error("Notification page has not been loaded");
    }
    // tim tat ca thong bao và click xem chi tiet thong bao
    let hrefsDetailsNoti = await page.$$eval("a", links =>
      links.map(a => a.href)
    );
    if (hrefsDetailsNoti.length > 0) {
      hrefsDetailsNoti = hrefsDetailsNoti.filter(e =>
        e.includes("/a/notifications")
      );
      const randomIndex = Math.floor(Math.random() * hrefsDetailsNoti.length);
      const href = hrefsDetailsNoti[randomIndex];
      const notiDetailsSelector = `[href="${href.replace(
        "https://mbasic.facebook.com",
        ""
      )}"]`;
      const checknotiDetailsBtn = await checkExistElement(
        page,
        notiDetailsSelector,
        3
      );
      if (checknotiDetailsBtn != 1) {
        throw Error("Element notification details is not exist");
      }
      await scrollSmoothIfNotExistOnScreen(page, notiDetailsSelector);
      const notiDetailsBtn = await getElement(page, notiDetailsSelector);
      if (notiDetailsBtn) {
        await notiDetailsBtn.click();
      } else {
        throw Error("Can not click into notification details");
      }
    }
    await delay(getRandomInt(3000, 5000));
    // check sang trang notification details ?
    url = await page.url();
    if (!url.includes("/story")) {
      throw Error("Notification details page has not been loaded");
    }
    // return page home
    const homeSelector = "#header > table > tbody > tr > td.l > a";
    const checkHomeSelector = await checkExistElement(page, homeSelector, 3);
    if (checkHomeSelector != 1) {
      throw Error("Element home facebook is not exist");
    }
    const homeBtn = await getElement(page, homeSelector, 10);
    if (homeBtn) {
      await homeBtn.click();
    } else {
      throw Error("Can not click into notification details");
    }
  } catch (error) {}
}
export default readNotifications;
