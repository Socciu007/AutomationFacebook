import delay from "../helpers/delay.js";
import getRandomInt from "../helpers/randomInt.js";
async function likeFacebook(page, numPosts) {
  let postsLiked = 0;
  let scrolledTimes = 0;
  try {
    while (postsLiked < numPosts) {
      // Scroll down a random amount
      const scrollAmount = getRandomInt(500, 1000); // For example, between 300 and 1000 pixels
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
            await delay(3000);
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
