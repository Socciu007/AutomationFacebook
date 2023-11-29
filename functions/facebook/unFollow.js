import delay from "../../helpers/delay.js";
import getRandomInt from "../../helpers/randomInt.js";

async function unFollows(page, numFollow) {
  const friendIcon = await page.$('a[href="/friends/"]');
  if (friendIcon == null) {
    throw new Error("Friend button not found. Please check your selector.");
  }
  await delay(3000);
  await friendIcon.click();
  await delay(3000);
  const friendList = await page.$('a[href="/friends/list/"]');
  if (friendList == null) {
    throw new Error(
      "Friend list button not found. Please check your selector."
    );
  }
  await delay(2000);
  await friendList.click();
  await delay(3000);
  // Lướt một khoảng random trước khi thực hiện chức năng
  let elapsedWaitTime = 0;
  while (elapsedWaitTime < 10000) {
    await page.mouse.wheel({ deltaY: getRandomInt(300, 500) });
    await delay(5000);
    elapsedWaitTime += 5000;
  }
  let count = 1;

  while (count < numFollow){
    await delay(2000);
    const elements = await page.$$(
      'div[class="x135pmgq"] > div[data-visualcompletion="ignore-dynamic"] > a[class="x1i10hfl x1qjc9v5 xjbqb8w xjqpnuy xa49m3k xqeqjp1 x2hbi6w x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x87ps6o x1lku1pv x1a2a7pz x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1lliihq"]'
    );
    console.log(elements.length);
    // const elements = await page.$$eval(
    //   'div[class="x135pmgq"] > div[data-visualcompletion="ignore-dynamic"] > a[class="x1i10hfl x1qjc9v5 xjbqb8w xjqpnuy xa49m3k xqeqjp1 x2hbi6w x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x87ps6o x1lku1pv x1a2a7pz x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1lliihq"]',
    //   (elements) => (elements ? elements.map((element) => element) : [])
    // );
    await delay(3000);
    if (elements.length === 0) {
      console.error("No elements found. Exiting loop.");
      break;
    }

    let randomIndex = Math.floor(Math.random() * (elements.length - 1));
    let inforButton = elements[randomIndex];
    console.log(randomIndex);
    if (inforButton) {
      await delay(2000);
      await inforButton.click();
      await delay(5000);
      const friendButton = await page.$x(
        "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div/div/div/div[4]/div/div/div[1]/div/div"
      );
      if (friendButton == null) {
        throw new Error("Friend button not found. Please check your selector.");
      }
      await delay(3000);
      await friendButton[0].click();
      await delay(5000);
      const unFollowsIcon = await page.$(
        'img[src="https://static.xx.fbcdn.net/rsrc.php/v3/yw/r/Kluyv0pwyPt.png"]'
      );
      const followIcon = await page.$(
        'img[src="https://static.xx.fbcdn.net/rsrc.php/v3/ya/r/SBPvsU_pPhg.png"]'
      );
      if (unFollowsIcon) {
        await delay(3000);
        await unFollowsIcon.click();
        console.log("Đã click unfollow");
        await delay(3000);
        count++;
        console.log(count);
      } else if (followIcon) {
        console.log("Chưa follow. Bỏ qua");
        await delay(3000);
      } else {
        throw new Error("Unfollow icon not found. Please check your selector.");
      }
    } else {
      throw new Error(
        "Friend information not found. Please check your selector."
      );
    }
  }
}
export default unFollows;
