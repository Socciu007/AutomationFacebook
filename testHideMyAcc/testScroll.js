const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

await delay(3000);
await page.goto("https://www.facebook.com/", {
  waitUntil: "networkidle2",
});
async function readContent(page, minDuration, maxDuration) {
  let postContent = "";
  const startTime = new Date();
  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // Random duration in milliseconds
  try {
    while (Date.now() - startTime < durationInMs) {
      try {
        // lấy nội dung của post
        postContent = await page.$eval(
          'div[data-ad-preview="message"]',
          (el) => el.innerText
        );
        if (postContent) {
          // Reset postContent to read the next post in the next iteration
          postContent = "";
        }
        // Scroll down a random amount
        const scrollAmount = getRandomInt(500, 1000); // For example, between 300 and 1000 pixels
        await page.mouse.wheel({ deltaY: scrollAmount });
        await delay(5000);
      } catch (error) {
        console.log("Content not found, scrolling...");
        // Scroll down a random amount
        const scrollAmount = getRandomInt(500, 1000); // For example, between 300 and 1000 pixels
        await page.mouse.wheel({ deltaY: scrollAmount });
        await delay(5000);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
await readContent(page, 1, 2);
