const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

await delay(1000);
await page.goto("https://www.facebook.com/", {
  waitUntil: "networkidle2",
});
async function shareFacebook(page, numPosts, minDuration, maxDuration) {
  let postShare = 0;
  let scrolledTimes = 0;
  const startTime = new Date();
  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // Random duration in milliseconds
  // Tính toán thời gian chờ giữa mỗi lần chia sẻ
  const waitTimeBetweenPosts = durationInMs / numPosts;
  try {
    while (Date.now() - startTime < durationInMs) {
      if (postShare >= numPosts) {
        // Nếu đã chia sẻ đủ bài, chỉ cuộn trang
        await page.mouse.wheel({ deltaY: getRandomInt(500, 1000) });
        await delay(2000);
        continue;
      }
      // Scroll down a random amount
      let elapsedWaitTime = 0;
      const scrollAmount = getRandomInt(400, 700);
      while (elapsedWaitTime < 0.3 * durationInMs) {
        await page.mouse.wheel({ deltaY: scrollAmount });
        await delay(5000);
        elapsedWaitTime += 5000;
      }
      // find the third div which contains share button
      const shareButtons = await page.$$(
        'div[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 x2lah0s x1qughib x1qjc9v5 xozqiw3 x1q0g3np x150jy0e x1e558r4 xjkvuk6 x1iorvi4 xwrv7xz x8182xy x4cne27 xifccgj"] > div[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x193iq5w xeuugli x1r8uery x1iyjqo2 xs83m0k xg83lxy x1h0ha7o x10b6aqq x1yrsyyn"]:nth-child(3)'
      );
      if (shareButtons.length > 0) {
        for (const button of shareButtons) {
          const buttonPosition = await button.boundingBox();
          //
          if (
            buttonPosition &&
            buttonPosition.y > scrolledTimes * scrollAmount
          ) {
            console.log("Share button found. Clicking...");
            await button.click();
            await delay(5000);
            const share = await page.$(
              'div[class="xsag5q8 xz9dl7a"] > div > div[data-visualcompletion="ignore-dynamic"]:nth-child(1)'
            );
            if (share) {
              await delay(5000);
              await share.click();
            } else {
              console.log("Can't share");
            }
            // Thực hiện cuộn trang trong thời gian chờ
            let elapsedWaitTime1 = 0;
            while (elapsedWaitTime1 < waitTimeBetweenPosts) {
              await page.mouse.wheel({ deltaY: getRandomInt(400, 700) });
              await delay(5000);
              elapsedWaitTime1 += 5000;
            }
            postShare++;
          }
        }
      } else {
        console.log("No like buttons found, scrolling more...");
      }
      scrolledTimes++;
    }
  } catch (error) {
    console.log(error);
  }
  console.log("Success");
}
await shareFacebook(page, 2, 1, 3);
await delay(5000);