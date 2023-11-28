const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

let logErrors = [];

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
try {
  const url = "https://www.facebook.com/";
  await navigateToUrl(page, url);
  await readContent(page, 1, 2);
} catch (error) {
  logErrors.push({
    error: "Error during newfeeds execution",
    detail: error.message,
  });
}
return logErrors;
