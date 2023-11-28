import delay from "../../helpers/delay.js";
import getRandomInt from "../../helpers/randomInt.js";


async function unFollows(page, numFollow) {
  const friendIcon = await page.$('a[href="/friends/"]');
  if (friendIcon == null) {
    throw new Error("Friend icon not found. Please check your selector.");
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
  while (count < numFollow) {

      let friendArea = await page.$$(
        'div[class="x6s0dn4 x1q0q8m5 x1qhh985 xu3j5b3 xcfux6l x26u7qi xm0m39n x13fuv20 x972fbf x9f619 x78zum5 x1q0g3np x1iyjqo2 xs83m0k x1qughib xat24cr x11i5rnm x1mh8g0r xdj266r xeuugli x18d9i69 x1sxyh0 xurb0ha xexx8yu x1n2onr6 x1ja2u2z x1gg8mnh"]'
      );
      if (friendArea == null) {
        throw new Error("Can't found friend aree. Please check your selector.");
      }
    console.log(friendArea.length);
    let randomIndex = Math.floor(Math.random() * friendArea.length);
    console.log(randomIndex);
    let moreButton = friendArea[randomIndex];
    console.log(moreButton);
    await delay(3000);
    await moreButton.click();
    await delay(3000);

    // if (unFollowsButton == null) {
    //   throw new Error("Unfollow button not found. Please check your selector.");
    // }
    // await delay(3000);
    // await unFollowsButton.click();
    const friendButton = await page.$x(
      "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div/div/div/div[4]/div/div/div[1]/div/div"
    );
    if (friendButton) {
      await delay(3000)
      await friendButton[0].click();
      const unFollowIcon = await page.$(
        'img[src="https://static.xx.fbcdn.net/rsrc.php/v3/yw/r/Kluyv0pwyPt.png"]'
      );
      const followIcon = await page.$(
        'img[src="https://static.xx.fbcdn.net/rsrc.php/v3/ya/r/SBPvsU_pPhg.png"]'
      );
      if(unFollowIcon) {
        await unFollowIcon.click();
      } else if(followIcon){
        continue
      } else {
        throw new Error(
          "Unfollow button or Follow button not found. Please check your selector."
        );
      }
    } 
     else {
      throw new Error("Friend button not found. Please check your selector.");
    }
  }
}
export default unFollows;
