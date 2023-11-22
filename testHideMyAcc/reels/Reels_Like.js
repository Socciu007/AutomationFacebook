const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

await delay(1000);
await page.goto("https://www.facebook.com/", {
  waitUntil: "networkidle2",
});

async function clickNext(page) {
  try {
    const nextButton = await page.$x(
      "//div[2]/div/div/div[1]/div/div/div/div/div[2]/div[1]/div/div/div[3]"
    );
    if (nextButton.length > 0) {
      await delay(getRandomInt(5000, 7000));
      await nextButton[0].click();
    }
  } catch (error) {
    logErrors.push({
      error: "Can't find next button",
      detail: error.message,
    });
  }
}
let logErrors = [];

async function likeReels(page, numsLike, minDuration, maxDuration) {
  try {
    const video = await page.$('a[aria-label="Video"]');
    if (video) {
      await delay(3000);
      await video.click();
    }
    await delay(3000);
    const reel = await page.$('a[href="/reel/"]');
    if (reel) {
      await delay(3000);
      await reel.click();
    }
    await delay(3000);
  } catch (error) {
    logErrors.push({
      error: "Can't find reels",
      detail: error.message,
    });
  }
  let likeReels = 0;
  let startTime = new Date();
  let count = 0;
  try {
    var durationInMs =
      (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // Random duration in milliseconds
    var waitTimeBetweenPosts = durationInMs / numsLike;
  } catch (error) {
    logErrors.push({
      error: "Can't estimate time input",
      detail: error.message,
    });
  }

  try {
    while (Date.now() - startTime < durationInMs) {
      if (likeReels >= numsLike) {
        // Nếu đã like đủ bài, chỉ bấm Next
        await clickNext(page);
        continue;
      }
      if (count == 0) {
        let elapsedWaitTime = 0;
        while (elapsedWaitTime < durationInMs * 0.3) {
          await clickNext(page);
          await delay(getRandomInt(3000, 7000));
          elapsedWaitTime += 5000;
        }
      }
      count++;
      try {
        // Find all the like buttons currently visible
        const likeButton = await page.$x(
          "//div[2]/div[2]/div/div/div/div[2]/div/div/div/div[1]/div"
        );

        if (likeButton.length > 0) {
          // Attempt to comment on a post that hasn't been commented on yet
          await likeButton[0].click();
          await delay(getRandomInt(3000, 7000));
          likeReels++;
          let elapsedWaitTime1 = 0;
          while (elapsedWaitTime1 < waitTimeBetweenPosts) {
            await clickNext(page);
            elapsedWaitTime1 += 5000;
          }
        }
      } catch (error) {
        logErrors.push({
          error: "Error while processing like button",
          detail: error.message,
        });
      }
    }
  } catch (error) {
    logErrors.push({
      error: "Unexpected error",
      detail: error.message,
    });
  }
}
try {
  await likeReels(page, 3, 1, 3);
  await delay(5000);
} catch (error) {
  logErrors.push({
    error: "Error during like Reels execution",
    detail: error.message,
  });
}
return logErrors;
