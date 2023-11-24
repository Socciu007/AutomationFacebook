const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

await delay(3000);
await page.goto("https://www.facebook.com/", {
  waitUntil: "networkidle2",
});
let logErrors = [];
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
  await readContent(page, 1, 2);
} catch (error) {
  logErrors.push({
    error: "Error during newfeeds execution",
    detail: error.message,
  });
}
console.log(logErrors);
