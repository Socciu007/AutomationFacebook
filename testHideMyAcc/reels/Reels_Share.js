const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
await delay(1000);
await page.goto("https://www.facebook.com/reel/", {
  waitUntil: "networkidle2",
});

async function clickNext(page) {
  const nextButton = await page.$x(
    "//div[1]/div/div[3]/div/div/div/div[1]/div[1]/div/div/div[1]/div/div/div/div/div/div[1]/div/div/div[3]"
  );
  if (nextButton.length > 0) {
    await delay(getRandomInt(5000, 7000));
    await nextButton[0].click();
  }
}
async function shareReels(page, numsShare, minDuration, maxDuration) {
  let shareReels = 0;
  const startTime = new Date();
  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // Random duration in milliseconds
  const waitTimeBetweenPosts = durationInMs / numsShare;
  try {
    while (Date.now() - startTime < durationInMs) {
      if (shareReels >= numsShare) {
        // Nếu đã share đủ bài, chỉ bấm Next
        const nextButton = await page.$x(
          "//div/div[2]/div/div/div/div[1]/div/div/div[3]"
        );
        if (nextButton.length > 0) {
          await delay(getRandomInt(5000, 10000));
          await nextButton[0].click();
        }
        await delay(getRandomInt(10000, 15000));
        continue;
      }
      let elapsedWaitTime = 0;
      while (elapsedWaitTime < waitTimeBetweenPosts / 2) {
        await clickNext(page);
        await delay(getRandomInt(3000, 7000));
        elapsedWaitTime += 5000;
      }
      // Find all the like buttons currently visible
      const shareButton = await page.$x(
        "//div/div[1]/div/div/div[2]/div[2]/div/div/div/div[4]"
      );

      if (shareButton.length > 0) {
        // Attempt to comment on a post that hasn't been commented on yet
        await shareButton[0].click();
        await delay(getRandomInt(3000, 7000));
        //div/div[3]/div/div/div/div[2]/div/div/div[1]/div[1]/div/div/div/div/div/div[1]/div/div/div[1]
        const share = await page.$x(
          "//div/div[3]/div/div/div/div[2]/div/div/div[1]/div[1]/div/div/div/div/div/div[1]/div/div/div[1]"
        );
        if (share.length > 0) {
          await share[0].click();
        }
        shareReels++;
        await clickNext(page);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

await shareReels(page, 2, 1, 3);
await delay(10000);
