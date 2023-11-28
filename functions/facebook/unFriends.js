import delay from "../../helpers/delay.js";
import getRandomInt from "../../helpers/randomInt.js";
let logErrors = [];
async function unFriends(page, numFriends) {
  await page.click('a[href="/friends/"]');
  await delay(3000);
  await page.click('a[href="/friends/list/"]');
  await delay(3000);
  let elapsedWaitTime = 0;
  while (elapsedWaitTime < 10000) {
    await page.mouse.wheel({ deltaY: getRandomInt(500, 700) });
    await delay(5000);
    elapsedWaitTime += 4000;
  }
  let count = 0;
  let moreButtons = await page.$$('div[class="x6s0dn4 x78zum5 x1q0g3np"]');

  while (count < numFriends) {
    try {
      let randomIndex = Math.floor(Math.random() * moreButtons.length);
      let moreButton = moreButtons[randomIndex];
      await delay(5000);
      await moreButton.click();
      await delay(3000);
      const unFriendsButton = await page.$(
        'div[class="x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou xe8uvvx x1hl2dhg xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x87ps6o x1lku1pv x1a2a7pz xjyslct x9f619 x1ypdohk x78zum5 x1q0g3np x2lah0s xnqzcj9 x1gh759c xdj266r xat24cr x1344otq x1de53dj x1n2onr6 x16tdsg8 x1ja2u2z x6s0dn4 x1y1aw1k xwib8y2"]:nth-child(4)'
      );

      if (unFriendsButton == null) {
        logErrors.push({
          error: "Error while finding unfriend button",
          detail: "Unfriend button not found. Please check your selector.",
        });
      } else {
        try {
          await delay(3000);
          await unFriendsButton.click();
        } catch (error) {
          logErrors.push({
            error: "Error while clicking unfriend button",
            detail: error.message,
          });
        }
      }
      await delay(3000);
      try {
        const confirm = await page.$(
          'div[class="x1n2onr6 x1ja2u2z x78zum5 x2lah0s xl56j7k x6s0dn4 xozqiw3 x1q0g3np xi112ho x17zwfj4 x585lrc x1403ito x972fbf xcfux6l x1qhh985 xm0m39n x9f619 xbxaen2 x1u72gb5 xtvsq51 x1r1pt67"]'
        );
        if (confirm == null) {
          logErrors.push({
            error: "Error while finding confirm button",
            detail: "Confirm button not found. Please check your selector.",
          });
        }
        await confirm.click();
        await delay(3000);
        count++;
      } catch (error) {
        logErrors.push({
          error: "Error while confirm unfriend",
          detail: error.message,
        });
        return;
      }
    } catch (error) {
      logErrors.push({
        error: "Error while processing unfriend button",
        detail: error.message,
      });
    }
  }
}

export default unFriends;