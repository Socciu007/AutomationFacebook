const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

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
async function inbox(page, numInboxes) {
  const items = await page.$$('ul[class="x1hc1fzr"] > li');
  if (items == null) {
    throw new Error("Person not found. Please check your selector.");
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
    const exit = await page.$('svg[class="xvijh9v xhhsvwb x1ty9z65 xgzva0m"]');
    // nhắn tin xong thì đóng khung chat
    if (exit == null) {
      throw new Error("Exit button not found. Please check your selector.");
    }
    await exit.click();
  }
}
try {
  const url = "https://www.facebook.com/";
  await navigateToUrl(page, url);
  await inbox(page, 3);
} catch (error) {
  logErrors.push({
    error: "Error during inbox execution",
    detail: error.message,
  });
}
return logErrors;
