import delay from "../../helpers/delay.js";
import getRandomInt from "../../helpers/randomInt.js";
let logErrors = [];
async function clickNext(page) {
  const nextButton = await page.$x(
    "//div[100]/div[2]/div/div/div/div/div[3]/div/div/div/div[1]/div[1]/div[3]/div"
  );
  if (nextButton.length > 0) {
    await delay(getRandomInt(5000, 7000));
    console.log("Click next");
    try {
      await nextButton[0].click();
    } catch (error) {
      logErrors.push({
        error: "Error while clicking next button",
        detail: error.message,
      });
    }
  } else {
    logErrors.push({
      error: "Error while finding next button",
      detail: "Next button not found. Please check your selector.",
    });
  }
}
async function storyFacebook(page, minDuration, maxDuration) {
  const story = await page.$$(
    'div[class = "x1c4vz4f x2lah0s xeuugli x1bhewko x1emribx xnqqybz"]'
  );
  if (story == null) {
    logErrors.push({
      error: "Error while finding story button",
      detail: "Story button not found. Please check your selector.",
    });
  }
  await story[1].click(); // click vao story dau tien
  await delay(5000);
  const startTime = new Date();
  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // random duration time
  while (Date.now() - startTime < durationInMs) {
    await delay(getRandomInt(10000, 15000));
    await clickNext(page);
  }
  console.log("End");
}
export default storyFacebook;
