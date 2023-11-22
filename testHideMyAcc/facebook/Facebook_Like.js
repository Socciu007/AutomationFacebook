const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

await delay(1000);
await page.goto("https://www.facebook.com/", {
  waitUntil: "networkidle2",
});
let logErrors = [];
async function likeFacebook(page, numPosts, minDuration, maxDuration) {
  let postsLiked = 0;
  let scrolledTimes = 0;
  const startTime = new Date();
  let count = 0;
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
      const scrollAmount = getRandomInt(400, 700);
      if (count == 0) {
        let elapsedWaitTime = 0;
        while (elapsedWaitTime < 0.3 * durationInMs) {
          await page.mouse.wheel({ deltaY: scrollAmount });
          await delay(5000);
          elapsedWaitTime += 5000;
        }
      }
      count++;
      try {
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
              await button.scrollIntoView({
                block: "center", // Đảm bảo button nằm ở trung tâm theo chiều dọc
                inline: "center", // Đảm bảo button nằm ở trung tâm theo chiều ngang
                behavior: "smooth", // Hiệu ứng cuộn mượt mà
              }),
                await delay(5000);
              await button.click();
              await delay(7000);
              // Thực hiện cuộn trang trong thời gian chờ
              let elapsedWaitTime1 = 0;
              while (elapsedWaitTime1 < waitTimeBetweenPosts) {
                await page.mouse.wheel({ deltaY: getRandomInt(400, 700) });
                await delay(5000);
                elapsedWaitTime1 += 5000;
              }
              postsLiked++;
            }
          }
        }
      } catch (error) {
        logErrors.push({
          error: "Error while processing like button",
          detail: error.message,
        });
      }
      scrolledTimes++;
    }
  } catch (error) {
    logErrors.push({
      error: "Unexpected error",
      detail: error.message,
    });
  }
}
try {
  await likeFacebook(page, 5, 1, 3);
  await delay(5000);
} catch (error) {
  logErrors.push({
    error: "Error during like Facebook execution",
    detail: error.message,
  });
}
return logErrors;
