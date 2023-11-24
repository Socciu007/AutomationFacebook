const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
let logErrors = [];
await delay(1000);
await page.goto("https://www.facebook.com/", {
  waitUntil: "networkidle2",
});
async function unFriends(page, numFriends) {
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
  let moreButtons = await page.$$('div[class="x6s0dn4 x78zum5 x1q0g3np"]');
  if (moreButtons == null) {
    throw new Error("Can't found any More button. Please check your selector.");
  }
  while (count < numFriends) {
    // click random 1 người
    let randomIndex = Math.floor(Math.random() * moreButtons.length);
    let moreButton = moreButtons[randomIndex];
    await delay(5000);
    await moreButton.click();
    await delay(3000);
    const unFriendsButton = await page.$(
      'div[class="x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou xe8uvvx x1hl2dhg xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x87ps6o x1lku1pv x1a2a7pz xjyslct x9f619 x1ypdohk x78zum5 x1q0g3np x2lah0s xnqzcj9 x1gh759c xdj266r xat24cr x1344otq x1de53dj x1n2onr6 x16tdsg8 x1ja2u2z x6s0dn4 x1y1aw1k xwib8y2"]:nth-child(4)'
    );
    if (unFriendsButton == null) {
      throw new Error("Unfriend button not found. Please check your selector.");
    }
    await delay(3000);
    await unFriendsButton.click();
    const confirm = await page.$(
      'div[class="x1n2onr6 x1ja2u2z x78zum5 x2lah0s xl56j7k x6s0dn4 xozqiw3 x1q0g3np xi112ho x17zwfj4 x585lrc x1403ito x972fbf xcfux6l x1qhh985 xm0m39n x9f619 xbxaen2 x1u72gb5 xtvsq51 x1r1pt67"]'
    );
    if (confirm == null) {
      throw new Error("Confirm button not found. Please check your selector.");
    }
    await confirm.click();
    await delay(3000);
    count++;
  }
}
try {
  await unFriends(page, 2);
  await delay(30000);
} catch (error) {
  logErrors.push({
    error: "Error during unfriend execution",
    detail: error.message,
  });
}
console.log(logErrors);
