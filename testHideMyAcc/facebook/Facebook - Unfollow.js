const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function navigateToUrl(page, url) {
  try {
    await page.goto(url, {
      waitUntil: "networkidle2",
    });
  } catch (error) {
    throw new Error(`Error navigating to URL: ${url}. ${error.message}`);
  }
}
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
    elapsedWaitTime += 5000;
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

    // if (unFollowsButton == null) {
    //   throw new Error("Unfollow button not found. Please check your selector.");
    // }
    // await delay(3000);
    // await unFollowsButton.click();
    const unFollowsIcon = await page.$(
      'i[style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yo/r/0Ep59Le9_WE.png&quot;); background-position: 0px -903px; background-size: auto; width: 20px; height: 20px; background-repeat: no-repeat; display: inline-block;"]'
    );
    const followIcon = await page.$(
      'i[style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yu/r/qpnL8A74oJq.png&quot;); background-position: 0px -63px; background-size: auto; width: 20px; height: 20px; background-repeat: no-repeat; display: inline-block;"]'
    );
    if(unFollowsIcon) {
      await delay(3000);
          const unFollowsButton = await page.$(
            'div[class="x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou xe8uvvx x1hl2dhg xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x87ps6o x1lku1pv x1a2a7pz xjyslct x9f619 x1ypdohk x78zum5 x1q0g3np x2lah0s xnqzcj9 x1gh759c xdj266r xat24cr x1344otq x1de53dj x1n2onr6 x16tdsg8 x1ja2u2z x6s0dn4 x1y1aw1k xwib8y2"]:nth-child(2)'
          );
          if(unFollowsButton){
               await unFollowsButton.click();
          } else {
            throw new Error(
              "Unfollow button not found. Please check your selector."
            );
          }
      count++;
    } else if(followIcon){
      await delay(3000);
      await moreButton.click();
      continue;
    } else {
      throw new Error("Unfollow icon not found. Please check your selector.");
    }
  }
}
try {
  const url = "https://www.facebook.com/";
  await navigateToUrl(page, url);
  await unFollows(page, 2);
} catch (error) {
  logErrors.push({
    error: "Error during unfollow execution",
    detail: error.message,
  });
}
return logErrors;