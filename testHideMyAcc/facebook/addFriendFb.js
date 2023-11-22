const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));
await delay(1000);
await page.goto("https://www.facebook.com/", {
  waitUntil: "networkidle2",
});
async function addFriend(page, numFriends) {
  await page.click('a[href="/friends/"]');
  let numsAdd = 0;
  const addButtons = await page.$$(
    'div[class="x1n2onr6 x1ja2u2z x78zum5 x2lah0s xl56j7k x6s0dn4 xozqiw3 x1q0g3np xi112ho x17zwfj4 x585lrc x1403ito x972fbf xcfux6l x1qhh985 xm0m39n x9f619 xn6708d x1ye3gou xtvsq51 x1r1pt67"]'
  );

  if (addButtons.length === 0) {
    return;
  }
  while (numsAdd < numFriends) {
    const randomIndex = Math.floor(Math.random() * addButtons.length);
    const addButton = addButtons[randomIndex];

    // Tính toán vị trí cần scroll
    const { y } = await addButton.boundingBox();
    const screenHeight = await page.evaluate(() => window.innerHeight);
    const scrollY = y - screenHeight / 6;
    // Scroll tới vị trí của button trước khi click
    await page.evaluate((scrollY) => {
      window.scrollTo({ top: scrollY, behavior: "smooth" });
    }, scrollY);
    await delay(5000);
    await addButton.click();
    numsAdd++;
  }
}
await addFriend(page, 3);
await delay(30000);
