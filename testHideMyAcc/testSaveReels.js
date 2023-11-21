const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function clickNext(page) {
  const nextButton = await page.$x(
    "//div[1]/div/div[3]/div/div/div/div[1]/div[1]/div/div/div[1]/div/div/div/div/div/div[1]/div/div/div[3]"
  );
  if (nextButton.length > 0) {
    await delay(getRandomInt(5000, 7000));
    await nextButton[0].click();
  }
}

async function saveReels(page, numsSave, minDuration, maxDuration) {
  let saveReels = 0;
  const startTime = new Date();
  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // Random duration in milliseconds
  const waitTimeBetweenPosts = durationInMs / numsSave;
  try {
    while (Date.now() - startTime < durationInMs) {
      if (saveReels >= numsSave) {
        // Nếu đã save đủ bài, chỉ bấm Next
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
      const saveButton = await page.$x(
        "//div[2]/div[1]/div/div[1]/div[3]/div/div/div[2]/div/div[3]"
      );

      if (saveButton.length > 0) {
        // Attempt to comment on a post that hasn't been commented on yet
        await saveButton[0].click();
        await delay(getRandomInt(3000, 7000));
        const save = await page.$x(
          "//div[3]/div/div/div/div[2]/div/div/div[1]/div[1]/div/div/div/div/div/div/div[1]/div/div[1]"
        );
        if (save.length > 0) {
          await save[0].click();
        } else {
          console.log("Can't save");
        }
        saveReels++;
        await clickNext(page);
      } else {
        console.log("No save buttons found, scrolling more...");
      }
    }
  } catch (error) {
    console.log(error);
  }
  console.log("Success");
}
await saveReels(page, 3, 1, 3);
await delay(10000);
