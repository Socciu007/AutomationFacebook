import delay from "../../helpers/delay.js";
import getRandomInt from "../../helpers/randomInt.js";
async function clickLike(page, scrollAmount, scrolledTimes, waitTime, postsLiked) {
  // Find all the like buttons currently visible
  const likeButtons = await page.$$(
    'span[class= "x3nfvp2"] > i[data-visualcompletion="css-img"]'
  );
  if (likeButtons.length > 0) {
    // Attempt to like a post that hasn't been liked yet
    for (const button of likeButtons) {
      // Ensure you're not clicking a button that's too far up (from previous posts)
      const buttonPosition = await button.boundingBox();
      if (buttonPosition && buttonPosition.y > scrolledTimes * scrollAmount) {
        // Tính toán vị trí cần scroll
        console.log("Có button");
        const { y } = await button.boundingBox();
        const screenHeight = await page.evaluate(() => window.innerHeight);
        const scrollY = y - screenHeight / 6;
        console.log("có scrollY");
        // Scroll tới vị trí của button trước khi click
        await page.evaluate((scrollY) => {
          window.scrollTo({ top: scrollY, behavior: "smooth" });
        }, scrollY);
        console.log("Đã lướt 1");
        await button.scrollIntoView({
          block: "center", // Đảm bảo button nằm ở trung tâm theo chiều dọc
          inline: "center", // Đảm bảo button nằm ở trung tâm theo chiều ngang
          behavior: "smooth", // Hiệu ứng cuộn mượt mà
        }),
        console.log("Đã lướt 2");
        await delay(3000);
        await button.click();
        console.log("Đã like");
        await delay(5000);
        // Thực hiện cuộn trang trong thời gian chờ
        await waitTimeBetweenPosts(page, waitTime * (10 / 3));
        postsLiked++;
      }
    }
  }
}
async function waitTimeBetweenPosts(page, durationInMs, scrollAmount) {
  let elapsedWaitTime = 0;
  while (elapsedWaitTime < 0.3 * durationInMs) {
    await page.mouse.wheel({ deltaY: scrollAmount });
    await delay(5000);
    elapsedWaitTime += 5000;
  }
}
async function likeFacebook(page, numPosts, minDuration, maxDuration) {
  let scrolledTimes = 0;
  const startTime = new Date();
  let postsLiked = 0;
  let count = 0;
  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // Random duration in milliseconds
  // Tính toán thời gian chờ giữa mỗi lần chia sẻ
  const waitTime = durationInMs / numPosts;
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
        await waitTimeBetweenPosts(page, durationInMs, scrollAmount);
      }
      count++;
      await clickLike(page, scrollAmount, scrolledTimes, waitTime, postsLiked);
      scrolledTimes++;
    }
  } catch (error) {
    console.log(error);
  }
}

export default likeFacebook;
