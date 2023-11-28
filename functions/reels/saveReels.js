import delay from "../../helpers/delay.js";
import getRandomInt from "../../helpers/randomInt.js";

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
async function clickReelIcon(page){
  const reel = await page.$('a[href="/reel/"]');
  if (reel == null) {
    throw new Error("Reels button not found. Please check your selector.");
  }
  await delay(3000);
  await reel.click();
}
async function clickVideoIcon(page){
  const video = await page.$('a[aria-label="Video"]');
  if (video == null) {
    throw new Error("Video button not found. Please check your selector.");
  }
  await delay(3000);
  await video.click();
}
async function saveReels(page, numsSave, minDuration, maxDuration) {
  await clickVideoIcon(page)
  await delay(3000);
  await clickReelIcon(page)
  await delay(3000);
  let saveReels = 0;
  const startTime = new Date();
  let count = 0;
  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // chọn 1 mốc thời gian để dừng trong khoảng min và max
  const waitTimeBetweenPosts = durationInMs / numsSave;
  while (Date.now() - startTime < durationInMs) {
    if (saveReels >= numsSave) {
      // Nếu đã save đủ bài, chỉ bấm Next
      await clickNext(page);
      continue;
    }
    // thời gian đầu sẽ lướt một thời gian, hạn chế việc vừa vào đã thực hiện chức năng
    if (count == 0) {
      let elapsedWaitTime = 0;
      while (elapsedWaitTime < durationInMs * 0.3) {
        await clickNext(page);
        await delay(getRandomInt(3000, 5000));
        elapsedWaitTime += 8000;
      }
    }
    count++;
    // Tìm nút save để click
    const saveButton = await page.$x(
      "//div[2]/div[1]/div/div[1]/div[3]/div/div/div[2]/div/div[3]"
    );

    if (saveButton.length > 0) {
      await saveButton[0].click();
      await delay(getRandomInt(3000, 7000));
      const save = await page.$x(
        "//div/div[5]/div/div/div[4]/div/div/div[1]/div[1]/div/div/div/div/div/div/div[1]/div/div[1]"
      );
      if (save.length > 0) {
        await save[0].click();
      } else {
        throw new Error("Save options not found. Please check your selector.");
      }
      saveReels++;
      // sau khi save thì click next, đảm bảo save đồng đều trong khoảng thời gian
      let elapsedWaitTime1 = 0;
      while (elapsedWaitTime1 < waitTimeBetweenPosts) {
        await clickNext(page);
        elapsedWaitTime1 += 5000;
      }
    } else {
      throw new Error("Save button not found. Please check your selector.");
    }
  }
}
export default saveReels;
