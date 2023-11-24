const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
await delay(1000);
await page.goto("https://www.facebook.com/", {
  waitUntil: "networkidle2",
});
let logErrors = [];
async function readNotifications(page, numsNoti) {
  // click notification icon 
  const notificationIcon = await page.$x("//div[2]/div[5]/div[1]/div[1]");
  if (notificationIcon == null) {
    throw new Error("Notification icon not found. Please check your selector.");
  }
  await notificationIcon[0].click();
  await delay(5000);
  // click vào nút xem tất cả
  const seeAllButton = await page.$(
    'a[href="https://www.facebook.com/notifications/"]'
  );
  if (seeAllButton == null) {
    throw new Error(
      "See all notification button not found. Please check your selector."
    );
  }
  await seeAllButton.click();
  await delay(5000);
  // lướt một khoảng random rồi tiếp tục chức năng
  let elapsedWaitTime = 0;
  while (elapsedWaitTime < 10000) {
    await page.mouse.wheel({ deltaY: getRandomInt(500, 700) });
    await delay(5000);
    elapsedWaitTime += 4000;
  }
  let count = 0;
  while (count < numsNoti) {
      // lặp lại việc click notifications icon và click
      const notificationIcon = await page.$x("//div[2]/div[5]/div[1]/div[1]");
      if (notificationIcon == null) {
         throw new Error(
           "Notification icon not found. Please check your selector."
         );
      }
      await notificationIcon[0].click();
      await delay(5000);
      // tìm tất cả các thông báo
      const notifications = await page.$$(
        'div[class="x6s0dn4 x1q0q8m5 x1qhh985 xu3j5b3 xcfux6l x26u7qi xm0m39n x13fuv20 x972fbf x9f619 x78zum5 x1q0g3np x1iyjqo2 xs83m0k x1qughib xat24cr x11i5rnm x1mh8g0r xdj266r xeuugli x18d9i69 x1sxyh0 xurb0ha xexx8yu x1n2onr6 x1ja2u2z x1gg8mnh"]'
      );
      if (notifications == null) {
        throw new Error(
          "Notifications not found. Please check your selector."
        );
      }
      await delay(5000);
      // click random 1 thông báo
      let randomIndex = Math.floor(Math.random() * notifications.length);
      let detailedNoti = notifications[randomIndex];
      await delay(5000);
      await detailedNoti.click();
      await delay(5000);
      count++;
  }
}
try {
  await readNotifications(page, 2);
} catch (error) {
  logErrors.push({
    error: "Error during read notifications execution",
    detail: error.message,
  });
}
console.log(logErrors);