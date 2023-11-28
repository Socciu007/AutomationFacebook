const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
await delay(1000);
await page.goto("https://www.facebook.com/", {
  waitUntil: "networkidle2",
});

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
async function search(page, keyword) {
  const search = await page.$(
    'label[class="x1a2a7pz x1qjc9v5 xnwf7zb x40j3uw x1s7lred x15gyhx8 x9f619 x78zum5 x1fns5xo x1n2onr6 xh8yej3 x1ba4aug xmjcpbm"]'
  );
  if (search == null) {
    throw new Error("Search button not found. Please check your selector.");
  }
  await search.click();
  await delay(5000);
  await page.keyboard.type(keyword);
  await delay(3000);
  await page.keyboard.press("Enter");
  // Scroll down a random amount
  const scrollAmount = getRandomInt(500, 1000);
  await page.mouse.wheel({ deltaY: scrollAmount });
  await delay(getRandomInt(3000, 7000));
}
try {
  const url = "https://www.facebook.com/";
  await navigateToUrl(page, url);
  await search(page, "Anh");
} catch (error) {
  logErrors.push({
    error: "Error during search execution",
    detail: error.message,
  });
}
return logErrors;
