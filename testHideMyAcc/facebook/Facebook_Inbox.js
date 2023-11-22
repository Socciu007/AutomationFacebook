const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

await delay(1000);
await page.goto("https://www.facebook.com/", {
  waitUntil: "networkidle2",
});

async function inbox(page, numInboxes) {
  try {
    const items = await page.$$('ul[class="x1hc1fzr"] > li');

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
      // await page.keyboard.press("Enter");
    }
  } catch (error) {
    console.log(error);
  }
}
await inbox(page, 3);
await delay(5000);
