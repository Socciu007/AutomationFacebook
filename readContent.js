import delay from "./delay.js";
async function readContent(page) {
  let postContent = "";
  while (!postContent) {
    try {
        // lấy nội dung của post
      postContent = await page.$eval(
        'div[data-ad-preview="message"]',
        (el) => el.innerText
      );
      if (postContent) {
        console.log(postContent);
        break;
      }
    } catch (error) {
      console.log("Content not found, scrolling...");
      await page.mouse.wheel({ deltaY: 300 });
      await delay(2000);
    }
  }
}
export default readContent;
