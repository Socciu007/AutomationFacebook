import delay from "../../helpers/delay.js";
import getRandomInt from "../../helpers/randomInt.js";
async function addFriend(page, numFriends) {
  await page.click('a[href="/friends/"]');
  await delay(3000);
   let elapsedWaitTime = 0;
   while (elapsedWaitTime < 10000) {
     await page.mouse.wheel({ deltaY: getRandomInt(500, 700) });
     await delay(5000);
     elapsedWaitTime += 2000;
   }
  let numsAdd = 0;
  let addButtons = await page.$$(
    'div[class="x1n2onr6 x1ja2u2z x78zum5 x2lah0s xl56j7k x6s0dn4 xozqiw3 x1q0g3np xi112ho x17zwfj4 x585lrc x1403ito x972fbf xcfux6l x1qhh985 xm0m39n x9f619 xn6708d x1ye3gou x1hr4nm9 x1r1pt67"]'
  );

  while (numsAdd < numFriends) {
    try {
      let randomIndex = Math.floor(Math.random() * addButtons.length);
      let addButton = addButtons[randomIndex];
      await delay(5000);
      
      await addButton.click();
      await delay(5000);
      numsAdd++;
    } catch (error) {
       logErrors.push({
         error: "Error while processing add friend button",
         detail: error.message,
       });
    }
  }
}

export default addFriend;
