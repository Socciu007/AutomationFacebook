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
async function likeFacebook(page, numPosts, minDuration, maxDuration) {
  let postsLiked = 0;
  let scrolledTimes = 0;
  const startTime = new Date();
  let count = 0;
  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // chọn 1 mốc thời gian để dừng trong khoảng min và max
  // Tính toán thời gian chờ giữa mỗi lần chia sẻ
  const waitTimeBetweenPosts = durationInMs / numPosts;
  while (Date.now() - startTime < durationInMs) {
    if (postsLiked >= numPosts) {
      // Nếu đã like đủ bài, chỉ cuộn trang
      await page.mouse.wheel({ deltaY: getRandomInt(500, 1000) });
      await delay(5000);
      continue;
    }
    // Lướt random một khoảng thời gian, tránh việc vừa vào đã thực hiện chức năng
    const scrollAmount = getRandomInt(400, 700);
    if (count == 0) {
      let elapsedWaitTime = 0;
      while (elapsedWaitTime < 0.3 * durationInMs) {
        await page.mouse.wheel({ deltaY: scrollAmount });
        await delay(5000);
        elapsedWaitTime += 5000;
      }
    }
    count++;
    // Tìm nút like ở page để click
    const likeButtons = await page.$$(
      'span[class= "x3nfvp2"] > i[data-visualcompletion="css-img"]'
    );

    if (likeButtons.length > 0) {
      for (const button of likeButtons) {
        // xem giải thích file explain
        const buttonPosition = await button.boundingBox();
        if (buttonPosition && buttonPosition.y > scrolledTimes * scrollAmount) {
          await button.scrollIntoView({
            block: "center", // Đảm bảo button nằm ở trung tâm theo chiều dọc
            inline: "center", // Đảm bảo button nằm ở trung tâm theo chiều ngang
            behavior: "smooth", // Hiệu ứng cuộn mượt mà
          }),
            await delay(5000);
          await button.click();
          await delay(5000);
          // Thực hiện cuộn trang trong thời gian chờ
          let elapsedWaitTime1 = 0;
          while (elapsedWaitTime1 < waitTimeBetweenPosts * 0.4) {
            await page.mouse.wheel({ deltaY: getRandomInt(400, 700) });
            await delay(5000);
            elapsedWaitTime1 += 5000;
          }
          postsLiked++;
        }
      }
    }
    scrolledTimes++;
  }
}
try {
  const url = "https://www.facebook.com/";
  await navigateToUrl(page, url);
  await likeFacebook(page, 5, 1, 3);
} catch (error) {
  logErrors.push({
    error: "Error during like Facebook execution",
    detail: error.message,
  });
}
return logErrors;
