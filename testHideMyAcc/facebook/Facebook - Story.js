const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function navigateToUrl(page, url) {
  try {
    await page.goto(url, {
      waitUntil: "networkidle2",
    });
  } catch (error) {
    throw new Error(`Error navigating to URL: ${url}. ${error.message}`);
  }
}


let logErrors = [];
async function clickNext(page) {
  const nextButton = await page.$x(
    "//div[3]/div[2]/div/div/div/div/div[3]/div/div/div/div[1]/div[1]/div[3]/div"
  );
  if (nextButton.length > 0) {
    await delay(getRandomInt(5000, 7000));
    await nextButton[0].click();
  } else {
    throw new Error("Next button not found. Please check your selector.");
  }
}
async function storyFacebook(page, minDuration, maxDuration) {
  const story = await page.$$(
    'div[class = "x1c4vz4f x2lah0s xeuugli x1bhewko x1emribx xnqqybz"]'
  );
  if (story == null) {
    throw new Error("Story button not found. Please check your selector.");
  }
  await story[1].click(); // click vào story đầu tiên
  await delay(5000);
  const startTime = new Date();
  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // chọn 1 mốc thời gian để dừng trong khoảng min và max
  while (Date.now() - startTime < durationInMs) {
    // nếu còn thời gian thì lướt tiếp
    await delay(getRandomInt(10000, 15000));
    await clickNext(page);
  }
}
try {
  const url = "https://www.facebook.com/";
  await navigateToUrl(page, url);
  await storyFacebook(page, 1, 3);
} catch (error) {
  logErrors.push({
    error: "Error during watch story execution",
    detail: error.message,
  });
}
return logErrors;
