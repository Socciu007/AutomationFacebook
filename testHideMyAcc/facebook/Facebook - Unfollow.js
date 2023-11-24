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
async function unFollows(page, numFollow) {
  const friendButton = await page.$('a[href="/friends/"]');
  if (friendButton == null) {
    throw new Error("Friend button not found. Please check your selector.");
  }
  await delay(3000);
  await friendButton.click();
  await delay(3000);
  const friendList = await page.$('a[href="/friends/list/"]');
  if (friendList == null) {
    throw new Error(
      "Friend list button not found. Please check your selector."
    );
  }
  await friendList.click();
  await delay(3000);
  // Lướt một khoảng random trước khi thực hiện chức năng
  let elapsedWaitTime = 0;
  while (elapsedWaitTime < 10000) {
    await page.mouse.wheel({ deltaY: getRandomInt(500, 700) });
    await delay(5000);
    elapsedWaitTime += 4000;
  }
  let count = 0;
  // click more
  let moreButtons = await page.$$('div[class="x6s0dn4 x78zum5 x1q0g3np"]');
  if (moreButtons == null) {
    throw new Error("Can't found any More button. Please check your selector.");
  }
  while (count < numFollow) {
    // click random 1 người
    let randomIndex = Math.floor(Math.random() * moreButtons.length);
    let moreButton = moreButtons[randomIndex];
    await delay(3000);
    await moreButton.click();
    await delay(3000);
    const unFollowsButton = await page.$(
      'div[class="x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou xe8uvvx x1hl2dhg xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x87ps6o x1lku1pv x1a2a7pz xjyslct x9f619 x1ypdohk x78zum5 x1q0g3np x2lah0s xnqzcj9 x1gh759c xdj266r xat24cr x1344otq x1de53dj x1n2onr6 x16tdsg8 x1ja2u2z x6s0dn4 x1y1aw1k xwib8y2"]:nth-child(2)'
    );
    if (unFollowsButton == null) {
      throw new Error("Unfollow button not found. Please check your selector.");
    }
    await delay(3000);
    await unFollowsButton.click();
  }
}
try {
  await unFollows(page, 2);
} catch (error) {
  logErrors.push({
    error: "Error during unfollow execution",
    detail: error.message,
  });
}
console.log(logErrors);
