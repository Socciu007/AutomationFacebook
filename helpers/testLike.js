const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

await delay(1000);
await page.goto("https://www.facebook.com/", {
  waitUntil: "networkidle2",
});
async function likeFacebook(page, numPosts, minDuration, maxDuration) {
  let postsLiked = 0;
  let scrolledTimes = 0;
  const startTime = new Date();
  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // Random duration in milliseconds
  // Tính toán thời gian chờ giữa mỗi lần chia sẻ
  const waitTimeBetweenPosts = durationInMs / numPosts;
  try {
    while (Date.now() - startTime < durationInMs) {
      if (postsLiked >= numPosts) {
        // Nếu đã like đủ bài, chỉ cuộn trang
        await page.mouse.wheel({ deltaY: getRandomInt(500, 1000) });
        await delay(5000);
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

      // Find all the like buttons currently visible
      const likeButtons = await page.$$(
        'span[class= "x3nfvp2"] > i[data-visualcompletion="css-img"]'
      );

      if (likeButtons.length > 0) {
        // Attempt to like a post that hasn't been liked yet
        for (const button of likeButtons) {
          // Ensure you're not clicking a button that's too far up (from previous posts)
          const buttonPosition = await button.boundingBox();
          if (
            buttonPosition &&
            buttonPosition.y > scrolledTimes * scrollAmount
          ) {
            console.log("Like button found. Clicking...");
            await button.click();
            // Thực hiện cuộn trang trong thời gian chờ
            await delay(5000);
            let elapsedWaitTime1 = 0;
            while (elapsedWaitTime1 < waitTimeBetweenPosts) {
              await page.mouse.wheel({ deltaY: getRandomInt(400, 700) });
              await delay(5000);
              elapsedWaitTime1 += 5000;
            }
            postsLiked++;
          }
        }
      } else {
        console.log("No like buttons found, scrolling more...");
      }
      scrolledTimes++;
    }
  } catch (error) {
    console.log(error);
  }
  console.log("Success");
}
await likeFacebook(page, 5, 1, 3);
await delay(5000);
