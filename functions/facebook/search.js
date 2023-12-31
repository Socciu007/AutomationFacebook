import delay from "../../helpers/delay.js";
import getRandomInt from "../../helpers/randomInt.js";
async function search(page, keyword) {
  try {
    const search = await page.$(
      'label[class="x1a2a7pz x1qjc9v5 xnwf7zb x40j3uw x1s7lred x15gyhx8 x9f619 x78zum5 x1fns5xo x1n2onr6 xh8yej3 x1ba4aug xmjcpbm"]'
    );
    if(search) {
      await search.click();
      await delay(5000);
      await page.keyboard.type(keyword);
      await delay(3000);
      await page.keyboard.press("Enter");
      // Scroll down a random amount
      const scrollAmount = getRandomInt(500, 1000);
      await page.mouse.wheel({ deltaY: scrollAmount });
      await delay(getRandomInt(3000, 7000));
    } else {    
        console.log("can't search");
    }
  } catch (error) {
    console.log(error);
  }
}
export default search;
