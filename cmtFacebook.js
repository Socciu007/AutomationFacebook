import delay from "./delay.js";
import Randomstring from "randomstring";
import getRandomInt from "./randomInt.js";
async function commentFacebook(page, numPosts) {
  let postsCommented = 0;
  let scrolledTimes = 0;

  while (postsCommented < numPosts) {
    // Scroll down a random amount
    const scrollAmount = getRandomInt(300, 1000);
    await page.mouse.wheel({ deltaY: scrollAmount });
    await delay(2000);

    // Find all the comment buttons currently visible
    const commentButtons = await page.$$(
      'div[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w xeuugli x150jy0e x1e558r4 x10b6aqq x1yrsyyn"] > i[data-visualcompletion="css-img"]'
    );

    if (commentButtons.length > 0) {
      // Attempt to comment on a post that hasn't been commented on yet
      for (const button of commentButtons) {
        const buttonPosition = await button.boundingBox();
        if (buttonPosition && buttonPosition.y > scrolledTimes * scrollAmount) {
          await button.click();
          await delay(2000);

          const randomString = Randomstring.generate({
            length: 12,
            charset: "alphabetic",
          });

          await page.keyboard.type(randomString);
          await page.keyboard.press("Enter");
          const closeButton = await page.$('div[class="xktsk01"] > div[role="button]');
          if(closeButton) {
            await page.click(
              'div[class="x1d52u69 xktsk01"] > div[role="button"]'
            );
          }
          await delay(2000);
          postsCommented++;
          break; // Break after commenting on one post
        }
      }
    } else {
      console.log("No comment buttons found, scrolling more...");
    }

    scrolledTimes++;
  }

  console.log(`Finished commenting on ${numPosts} posts!`);
}

export default commentFacebook;
