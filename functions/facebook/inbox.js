import delay from "../helpers/delay.js";

async function inbox(page, numInboxes) {
  try {
    const items = await page.$$('ul[class="x1hc1fzr"] > li');
    if (!items) {
      console.log("Không tìm thấy thẻ");
    }

    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    for (let i = 0; i < numInboxes; i++) {
      await items[i].click();
      await delay(5000);
      await page.keyboard.type("Hi!");
      await delay(5000);
      await page.keyboard.press("Enter");
      await delay(5000);
      await page.click('svg[class="xvijh9v xhhsvwb x1ty9z65 xgzva0m"]');
      console.log("Inbox thành công");
      // await page.keyboard.press("Enter");
    }
  } catch (error) {
    console.log(error);
  }
}
export default inbox;
