const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// await delay(1000);
// await page.goto("https://www.facebook.com/", {
//   waitUntil: "networkidle2",
// });

async function clickNext(page) {
  const nextButton = await page.$x(
    "//div[2]/div/div/div[1]/div/div/div/div/div[2]/div[1]/div/div/div[3]"
  );
  if (nextButton.length > 0) {
    await delay(getRandomInt(5000, 7000));
    await nextButton[0].click();
  } else {
    throw new Error("Next button not found. Please check your selector.");
  }
}
async function saveReels(page, numsSave, minDuration, maxDuration) {
  const video = await page.$('abc[aria-label="Video"]');
  if (video == null) {
    throw new Error("Video button not found. Please check your selector.");
  }
  await delay(3000);
  await video.click();
  await delay(3000);
  const reel = await page.$('a[href="/reel/"]');
  if (reel == null) {
    throw new Error("Reels button not found. Please check your selector.");
  }
  await delay(3000);
  await reel.click();
  await delay(3000);
  let saveReels = 0;
  const startTime = new Date();
  let count = 0;
  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // Random duration in milliseconds
  const waitTimeBetweenPosts = durationInMs / numsSave;
  try {
    while (Date.now() - startTime < durationInMs) {
      if (saveReels >= numsSave) {
        // Nếu đã save đủ bài, chỉ bấm Next
        await clickNext(page);
        continue;
      }
      if (count == 0) {
        let elapsedWaitTime = 0;
        while (elapsedWaitTime < durationInMs * 0.3) {
          await clickNext(page);
          await delay(getRandomInt(3000, 5000));
          elapsedWaitTime += 8000;
        }
      }
      count++;
      try {
        // Find all the save buttons currently visible
        const saveButton = await page.$x(
          "//div[2]/div[1]/div/div[1]/div[3]/div/div/div[2]/div/div[3]"
        );

        if (saveButton.length > 0) {
          await saveButton[0].click();
          await delay(getRandomInt(3000, 7000));
          const save = await page.$x(
            "//div/div[100]/div/div/div[4]/div/div/div[1]/div[1]/div/div/div/div/div/div/div[1]/div/div[1]"
          );
          if (save.length > 0) {
            await save[0].click();
          } else {
            throw new Error(
              "Save button not found. Please check your selector."
            );
          }
          saveReels++;
          let elapsedWaitTime1 = 0;
          while (elapsedWaitTime1 < waitTimeBetweenPosts) {
            await clickNext(page);
            elapsedWaitTime1 += 5000;
          }
        } else {
          throw new Error("Can't find any save buttons. Please check your selector.");
        }
      } catch (error) {
        throw new Error(error.message);
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
// try {
//   await saveReels(page, 3, 1, 3);
//   await delay(10000);
// } catch (error) {
//   logErrors.push({
//     error: "Error during save reel execution",
//     detail: error.message,
//   });
//   throw new Error("Stopping execution due to errors");
// }
export default saveReels;
