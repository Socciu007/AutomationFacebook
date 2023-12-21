const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

const array = [
  "Xin chào",
  "Hello",
  "Hay quá",
  "Sản phẩm dùng tốt quá",
  "Lạnh gheee",
  "Xuất sắc",
];

function getRandomText(array) {
  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

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
async function commentFacebook(page, numPosts, minDuration, maxDuration) {
  let postsCommented = 0;
  let scrolledTimes = 0;
  let count = 0;
  const startTime = new Date();
  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // chọn 1 mốc thời gian để dừng trong khoảng min và max
  // Tính toán thời gian chờ giữa mỗi lần comment
  const waitTimeBetweenPosts = durationInMs / numPosts;
  while (Date.now() - startTime < durationInMs) {
    if (postsCommented >= numPosts) {
      // Nếu đã like đủ bài, chỉ cuộn trang
      await page.mouse.wheel({ deltaY: getRandomInt(500, 1000) });
      await delay(2000);
      continue;
    }

    // Bắt đầu sẽ lướt một khoảng random trước khi thực hiện chức năng
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
    // Tìm nút comments có trên page
    const commentButtons = await page.$$(
      'div[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 x2lah0s x1qughib x1qjc9v5 xozqiw3 x1q0g3np x150jy0e x1e558r4 xjkvuk6 x1iorvi4 xwrv7xz x8182xy x4cne27 xifccgj"] > div[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k xg83lxy x1h0ha7o x10b6aqq x1yrsyyn"]:nth-child(2)'
    );

    if (commentButtons.length > 0) {
      for (const button of commentButtons) {
        const buttonPosition = await button.boundingBox();
        // xem file explain cho đoạn code sau
        if (buttonPosition && buttonPosition.y > scrolledTimes * scrollAmount) {
          await button.scrollIntoView({
            block: "center", // Đảm bảo button nằm ở trung tâm theo chiều dọc
            inline: "center", // Đảm bảo button nằm ở trung tâm theo chiều ngang
            behavior: "smooth", // Hiệu ứng cuộn mượt mà
          }),
          await delay(3000);
          await button.click();
          await delay(3000);
          // comment random
          const randomString = getRandomText(array);
          await page.keyboard.type(randomString);
          await delay(5000);
          await page.keyboard.press("Enter");
          await delay(5000);
          // nếu có dialog 
          const dialog = await page.$('div[role="dialog"]');
          if (dialog) {
            await delay(3000);
            await page.keyboard.press("Escape");
            await delay(3000);
          }
          
          // lướt một khoảng thời gian sau comment, đảm bảo trong khoảng thời gian đó comment đều nhau
          let elapsedWaitTime1 = 0;
          while (elapsedWaitTime1 < waitTimeBetweenPosts * 0.4) {
            await page.mouse.wheel({ deltaY: getRandomInt(400, 700) });
            await delay(5000);
            elapsedWaitTime1 += 5000;
          }
          postsCommented++;
        }
      }
    }
    scrolledTimes++;
  }
}
try {
  const url = "https://www.facebook.com/";
  await navigateToUrl(page, url);
  await commentFacebook(page, 3, 1, 3);
} catch (error) {
  logErrors.push({
    error: "Error during commentFacebook execution",
    detail: error.message,
  });
}
return logErrors;
