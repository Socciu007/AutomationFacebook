import delay from "../../helpers/delay.js";
import getRandomInt from "../../helpers/randomInt.js";
let logErrors = [];
async function readNotifications(page, numsNoti) {
  const notificationIcon = await page.$x("//div[2]/div[5]/div[1]/div[1]");
  if (notificationIcon == null) {
    logErrors.push({
      error: "Error while finding notification icon",
      detail: "Notification icon not found. Please check your selector.",
    });
  }
  await notificationIcon[0].click();
  await delay(5000);
  const seeAllButton = await page.$(
    'a[href="https://www.facebook.com/notifications/"]'
  );
  if (seeAllButton == null) {
    logErrors.push({
      error: "Error while finding see all notification button",
      detail:
        "See all notification button not found. Please check your selector.",
    });
  }
  await seeAllButton.click();
  await delay(5000);
  let elapsedWaitTime = 0;
  while (elapsedWaitTime < 10000) {
    await page.mouse.wheel({ deltaY: getRandomInt(500, 700) });
    await delay(5000);
    elapsedWaitTime += 4000;
  }
  let count = 0;
  while (count < numsNoti) {
    try {
      const notificationIcon = await page.$x("//div[2]/div[5]/div[1]/div[1]");
      if (notificationIcon == null) {
        logErrors.push({
          error: "Error while finding notification icon",
          detail: "Notification icon not found. Please check your selector.",
        });
      }
      await notificationIcon[0].click();
      await delay(5000)
      const notifications = await page.$$(
        'div[class="x6s0dn4 x1q0q8m5 x1qhh985 xu3j5b3 xcfux6l x26u7qi xm0m39n x13fuv20 x972fbf x9f619 x78zum5 x1q0g3np x1iyjqo2 xs83m0k x1qughib xat24cr x11i5rnm x1mh8g0r xdj266r xeuugli x18d9i69 x1sxyh0 xurb0ha xexx8yu x1n2onr6 x1ja2u2z x1gg8mnh"]'
      );
      if (notifications == null) {
        logErrors.push({
          error: "Error while finding notification button",
          detail: " notification button not found. Please check your selector.",
        });
      }
      await delay(5000);
      let randomIndex = Math.floor(Math.random() * notifications.length);
      let detailedNoti = notifications[randomIndex];
      await delay(5000);
      await detailedNoti.click();
      await delay(5000);
      count++;
    } catch (error) {
      logErrors.push({
        error: "Error while finding notification detailed",
        detail: error.message,
      });
    }
  }
}
export default readNotifications;
