import delay from "../../helpers/delay.js";
import getRandomInt from "../../helpers/randomInt.js";
async function shareFacebook(page, numsPosts) {
  let postShare = 0;
  let scrolledTimes = 0;
  try {
    while (postShare < numsPosts) {
      // Scroll down a random amount
      const scrollAmount = getRandomInt(500, 1000); // For example, between 300 and 1000 pixels
      await page.mouse.wheel({ deltaY: scrollAmount });
      await delay(2000);
      // find the third div which contains share button
      const shareButtons = await page.$$(
        'div[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 x2lah0s x1qughib x1qjc9v5 xozqiw3 x1q0g3np x150jy0e x1e558r4 xjkvuk6 x1iorvi4 xwrv7xz x8182xy x4cne27 xifccgj"] > div[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k xg83lxy x1h0ha7o x10b6aqq x1yrsyyn"]:nth-child(3)'
      );
      if (shareButtons.length > 0) {
        for (const button of shareButtons) {
          const buttonPosition = await button.boundingBox();
          // 
          if (
            buttonPosition &&
            buttonPosition.y > scrolledTimes * scrollAmount
          ) {
            console.log("Share button found. Clicking...");
            // Tính toán vị trí cần scroll
            const { y } = await button.boundingBox();
            const screenHeight = await page.evaluate(() => window.innerHeight);
            const scrollY = y - screenHeight / 6;
            // Scroll tới vị trí của button trước khi click
            await page.evaluate((scrollY) => {
              window.scrollTo({ top: scrollY, behavior: "smooth" });
            }, scrollY);
            await button.scrollIntoView({
              block: "center", // Đảm bảo button nằm ở trung tâm theo chiều dọc
              inline: "center", // Đảm bảo button nằm ở trung tâm theo chiều ngang
              behavior: "smooth", // Hiệu ứng cuộn mượt mà
            }),
            await delay(3000);
            await button.click();
            await delay(3000);
            const share = await page.$(
              'div[class="xsag5q8 xz9dl7a"] > div > div[data-visualcompletion="ignore-dynamic"]:nth-child(1)'
            );
            if (share) {
              await share.click();
            } else {
              console.log("Can't share");
            }
            await delay(3000);
            postShare++;
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
export default shareFacebook;