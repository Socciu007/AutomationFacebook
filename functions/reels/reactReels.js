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
async function clickReelIcon(page) {
  const reel = await page.$('a[href="/reel/"]');
  if (reel == null) {
    throw new Error("Reels button not found. Please check your selector.");
  }
  await delay(3000);
  await reel.click();
}
async function clickVideoIcon(page) {
  const video = await page.$('a[aria-label="Video"]');
  if (video == null) {
    throw new Error("Video button not found. Please check your selector.");
  }
  await delay(3000);
  await video.click();
}
async function reactReels(page, numsLike, minDuration, maxDuration) {
  await clickVideoIcon(page);
  await delay(3000);
  await clickReelIcon(page);
  await delay(3000);
  let likeReels = 0;
  const startTime = new Date();
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
    // tìm nút like để click
    const likeButton = await page.$x(
      "//div[2]/div[2]/div/div/div/div[2]/div/div/div/div[1]/div"
    );

    if (likeButton.length > 0) {
      await likeButton[0].click();
      await delay(getRandomInt(3000, 7000));
      if (Math.random() < 0.25) {
        // xảy ra 2 trường hợp, có vùng comment luôn hoặc phải nhấn nút mới comment được
        // TH1: phải nhấn nút comment để xuất hiện vùng comment
        const complementary = await page.$('div[role="complementary"]');
        if (complementary) {
          const commentArea = await page.$x("//form/div/div[1]");
          if (commentArea.length > 0) {
            await commentArea[0].click();
            const randomString = getRandomText(array);
            await page.keyboard.type(randomString);
            await delay(5000);
            await page.keyboard.press("Enter");
            await delay(3000);
          } else {
            throw new Error(
              "Comment area not found. Please check your selector."
            );
          }
        } else {
          // TH2: comment ngay khi lướt
          const commentButton = await page.$x(
            "//div[1]/div[1]/div/div/div[2]/div[2]/div/div/div/div[3]"
          );
          await commentButton[0].click();
          await delay(2000);
          const commentArea = await page.$x("//form/div/div[1]");
          if (commentArea.length > 0) {
            await commentArea[0].click();
            const randomString = getRandomText(array);
            await page.keyboard.type(randomString);
            await delay(5000);
            await page.keyboard.press("Enter");
            await delay(5000);
          } else {
            throw new Error(
              "Comment area not found. Please check your selector."
            );
          }
        }
      }
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
export default reactReels;
