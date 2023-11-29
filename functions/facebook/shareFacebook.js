import delay from "../../helpers/delay.js";
import getRandomInt from "../../helpers/randomInt.js";
async function shareFacebook(page, numPosts, minDuration, maxDuration) {
  let postShare = 0;
  let scrolledTimes = 0;
  let count = 0;
  const startTime = new Date();
  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // chọn 1 mốc thời gian để dừng trong khoảng min và max
  // Tính toán thời gian chờ giữa mỗi lần chia sẻ
  const waitTimeBetweenPosts = durationInMs / numPosts;
  while (Date.now() - startTime < durationInMs) {
    if (postShare >= numPosts - 1) {
      // Nếu đã chia sẻ đủ bài, chỉ cuộn trang
      await page.mouse.wheel({ deltaY: getRandomInt(500, 1000) });
      await delay(2000);
      continue;
    }
    // Bắt đầu sẽ lướt trong 1 khoảng thời gian, tránh việc thực hiện ngay chức năng
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
    // Tìm nút share trong page
    const shareButtons = await page.$$(
      'div[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 x2lah0s x1qughib x1qjc9v5 xozqiw3 x1q0g3np x150jy0e x1e558r4 xjkvuk6 x1iorvi4 xwrv7xz x8182xy x4cne27 xifccgj"] > div[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k xg83lxy x1h0ha7o x10b6aqq x1yrsyyn"]:nth-child(3)'
    );
    if (shareButtons.length > 0) {
      for (const button of shareButtons) {
        const buttonPosition = await button.boundingBox();
        // xem file explain
        if (buttonPosition && buttonPosition.y > scrolledTimes * scrollAmount) {
          await button.scrollIntoView({
            block: "center", // Đảm bảo button nằm ở trung tâm theo chiều dọc
            inline: "center", // Đảm bảo button nằm ở trung tâm theo chiều ngang
            behavior: "smooth", // Hiệu ứng cuộn mượt mà
          }),
          await delay(3000);
          await button.click();
          await delay(5000);
          const closeButton = await page.$(
            'div[class="x92rtbv x10l6tqk x1tk7jg1 x1vjfegm"]'
          );
          if (closeButton) {
            await delay(3000);
            await closeButton.click();
            continue;
          } else {
            const share = await page.$(
              'div[class="xsag5q8 xz9dl7a"] > div > div[data-visualcompletion="ignore-dynamic"]:nth-child(1)'
            );
            if (share == null) {
              throw new Error(
                "Share options not found. Please check your selector"
              );
            }
            await delay(5000);
            await share.click();
            // Thực hiện cuộn trang trong thời gian chờ
            let elapsedWaitTime1 = 0;
            while (elapsedWaitTime1 < waitTimeBetweenPosts * 0.4) {
              await page.mouse.wheel({ deltaY: getRandomInt(400, 700) });
              await delay(5000);
              elapsedWaitTime1 += 5000;
            }
            postShare++;
          }
        }
      }
    } else {
      throw new Error("Share button not found. Please check your selector");
    }
    scrolledTimes++;
    await page.mouse.wheel({ deltaY: getRandomInt(100, 200) });
  }
}
export default shareFacebook;