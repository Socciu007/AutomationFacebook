const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

const array = [
  "Xin chào",
  "Hello",
  "Hay quá",
  "Sản phẩm dùng tốt quá",
  "Lạnh gheee",
  "Xuất sắc",
];

function getRandomText(array) {
  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

await delay(1000);
await page.goto("https://www.facebook.com/", {
  waitUntil: "networkidle2",
});
async function commentFacebook(page, numPosts, minDuration, maxDuration) {
  let postsCommented = 0;
  let scrolledTimes = 0;
  const startTime = new Date();
  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // Random duration in milliseconds
  // Tính toán thời gian chờ giữa mỗi lần chia sẻ
  const waitTimeBetweenPosts = durationInMs / numPosts;
  try {
    while (Date.now() - startTime < durationInMs) {
      if (postsCommented >= numPosts) {
        // Nếu đã like đủ bài, chỉ cuộn trang
        await page.mouse.wheel({ deltaY: getRandomInt(500, 1000) });
        await delay(2000);
        continue;
      }
      // Scroll down a random amount
      let elapsedWaitTime = 0;
      const scrollAmount = getRandomInt(400, 700);
      while (elapsedWaitTime < 0.3 * durationInMs) {
        await page.mouse.wheel({ deltaY: scrollAmount });
        await delay(5000);
        elapsedWaitTime += 5000;
      }
      // Find all the comment buttons currently visible
      const commentButtons = await page.$$(
        'div[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w xeuugli x150jy0e x1e558r4 x10b6aqq x1yrsyyn"] > i[data-visualcompletion="css-img"]'
      );

      if (commentButtons.length > 0) {
        // Attempt to comment on a post that hasn't been commented on yet
        for (const button of commentButtons) {
          const buttonPosition = await button.boundingBox();
          if (
            buttonPosition &&
            buttonPosition.y > scrolledTimes * scrollAmount
          ) {
            await button.click();
            await delay(3000);

            const randomString = getRandomText(array);
            await page.keyboard.type(randomString);
            await delay(5000);
            await page.keyboard.press("Enter");
            await delay(5000);
            const closeButton = await page.$('div[role="dialog"]');
            if (closeButton) {
              await delay(5000);
              await page.keyboard.press("Escape");
            } else {
              console.log("Can't close dialog");
            }
            await delay(5000);
            let elapsedWaitTime1 = 0;
            while (elapsedWaitTime1 < waitTimeBetweenPosts) {
              await page.mouse.wheel({ deltaY: getRandomInt(400, 700) });
              await delay(5000);
              elapsedWaitTime1 += 5000;
            }
            postsCommented++;
          }
        }
      } else {
        console.log("No comment buttons found, scrolling more...");
      }
      scrolledTimes++;
    }
  } catch (error) {
    console.log(error);
  }
  console.log("Success");
}
await commentFacebook(page, 3, 1, 3);
await delay(5000);
