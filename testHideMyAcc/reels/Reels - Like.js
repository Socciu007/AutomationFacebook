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
let logErrors = [];

async function likeReels(page, numsLike, minDuration, maxDuration) {
  // click video
  const video = await page.$('a[aria-label="Video"]');
  if (video == null) {
    throw new Error("Video button not found. Please check your selector.");
  }
  await delay(3000);
  await video.click();
  await delay(3000);
  // click reels
  const reel = await page.$('a[href="/reel/"]');
  if (reel == null) {
    throw new Error("Reels button not found. Please check your selector.");
  }
  await delay(3000);
  await reel.click();
  await delay(3000);
  let likeReels = 0;
  let startTime = new Date();
  let count = 0;
  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // chọn 1 mốc thời gian để dừng trong khoảng min và max
  const waitTimeBetweenPosts = durationInMs / numsLike;

  while (Date.now() - startTime < durationInMs) {
    if (likeReels >= numsLike) {
      // Nếu đã like đủ bài, chỉ bấm Next
      await clickNext(page);
      continue;
    }
    // thời gian đầu sẽ lướt một thời gian, hạn chế việc vừa vào đã thực hiện chức năng
    if (count == 0) {
      let elapsedWaitTime = 0;
      while (elapsedWaitTime < durationInMs * 0.3) {
        await clickNext(page);
        await delay(getRandomInt(3000, 7000));
        elapsedWaitTime += 5000;
      }
    }
    count++;

    // Tìm nút like 
    const likeButton = await page.$x(
      "//div[2]/div[2]/div/div/div/div[2]/div/div/div/div[1]/div"
    );

    if (likeButton.length > 0) {
      await likeButton[0].click();
      await delay(getRandomInt(3000, 7000));
      likeReels++;
      // sau khi like thì click next, đảm bảo like đồng đều trong khoảng thời gian
      let elapsedWaitTime1 = 0;
      while (elapsedWaitTime1 < waitTimeBetweenPosts) {
        await clickNext(page);
        elapsedWaitTime1 += 5000;
      }
    } else {
      throw new Error("Like button not found. Please check your selector.");
    }
  }
}
try {
  await likeReels(page, 3, 1, 3);
} catch (error) {
  logErrors.push({
    error: "Error during like reels execution",
    detail: error.message,
  });
}
console.log(logErrors);
