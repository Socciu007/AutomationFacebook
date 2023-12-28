import delay from "./delay.js";
import checkIsLive from "./checkIsLive.js";
async function checkExistElement(page, JSpath, timeWait_Second) {
  let flag = true;
  try {
    const tickCount = Date.now();
    const element = await page.$$(JSpath);
    while (element.length === 0) {
      if (Date.now() - tickCount > timeWait_Second * 1000) {
        flag = false;
        break;
      }

      if (checkIsLive(page) == false) {
        return -2;
      }

      await delay(1000);
    }
  } catch (error) {
    flag = false;
  }

  return flag ? 1 : 0;
}
export default checkExistElement;
