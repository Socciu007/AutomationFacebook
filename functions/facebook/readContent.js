import delay from "../../helpers/delay.js";
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
          // console.log(postContent);
          // Reset postContent to read the next post in the next iteration
          postContent = "";
        }
        // Scroll down
        await page.mouse.wheel({ deltaY: 300 });
        await delay(2000);
      } catch (error) {
        console.log("Content not found, scrolling...");
        await page.mouse.wheel({ deltaY: 300 });
        await delay(2000);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
export default readContent;
