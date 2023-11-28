import delay from "../../helpers/delay.js";
import getRandomInt from "../../helpers/randomInt.js";
async function readContent(page, minDuration, maxDuration) {
  const startTime = new Date();
  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // chọn 1 mốc thời gian để dừng trong khoảng min và max
  while (Date.now() - startTime < durationInMs) {
    // Scroll down a random amount
    const scrollAmount = getRandomInt(500, 1000);
    await page.mouse.wheel({ deltaY: scrollAmount });
    await delay(5000);
  }
}
export default readContent;
