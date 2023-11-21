import delay from "../../helpers/delay.js";
import getRandomInt from "../../helpers/randomInt.js";
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
      if (postShare >= numPosts) {
        // Nếu đã chia sẻ đủ bài, chỉ cuộn trang
        await page.mouse.wheel({ deltaY: getRandomInt(500, 1000) });
        await delay(2000);
        continue;
      }
      // Scroll down a random amount
      const scrollAmount = getRandomInt(500, 1000); 
      await page.mouse.wheel({ deltaY: scrollAmount });
      await delay(2000);

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
             await delay(waitTimeBetweenPosts);
            postsLiked++;
            break;
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

export default likeFacebook;
