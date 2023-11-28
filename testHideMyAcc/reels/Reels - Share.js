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
async function shareReels(page, numsShare, minDuration, maxDuration) {
  await clickVideoIcon(page);
  await delay(3000);
  await clickReelIcon(page);
  await delay(3000);
  let shareReels = 0;
  const startTime = new Date();
  let count = 0;
  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // chọn 1 mốc thời gian để dừng trong khoảng min và max
  // Tính toán thời gian chờ giữa mỗi lần chia sẻ
  const waitTimeBetweenPosts = durationInMs / numsShare;
  while (Date.now() - startTime < durationInMs) {
    if (shareReels >= numsShare) {
      // Nếu đã share đủ bài, chỉ bấm Next
      await clickNext(page);
      continue;
    }
    // thời gian đầu sẽ lướt một thời gian, hạn chế việc vừa vào đã thực hiện chức năng
    if (count == 0) {
      let elapsedWaitTime = 0;
      while (elapsedWaitTime < durationInMs * 0.1) {
        await clickNext(page);
        await delay(getRandomInt(3000, 5000));
        elapsedWaitTime += 5000;
      }
    }
    count++;
    // Tìm nút share để click
    const shareButton = await page.$x(
      "//div/div[1]/div/div/div[2]/div[2]/div/div/div/div[4]"
    );

    if (shareButton.length > 0) {
      await shareButton[0].click();
      await delay(getRandomInt(3000, 5000));
      const dialog = await page.$(
        'div[class="x9f619 x78zum5 xl56j7k x2lwn1j xeuugli x47corl x1qjc9v5 x1bwycvy x1e558r4 x150jy0e x1x97wu9 xbr3nou xqit15g x1bi8yb4"]'
      );
      if (dialog) {
        const shareNow = await page.$(
          'div[class="x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x87ps6o x1lku1pv x1a2a7pz x9f619 x3nfvp2 xdt5ytf xl56j7k x1n2onr6 xh8yej3"]'
        );
        if (shareNow == null) {
          throw new Error("Can't share. Please check your selector.");
        } else {
          await shareNow.click();
          await delay(3000);
        }
      } else {
        const share = await page.$x(
          "//div/div/div[4]/div/div/div[1]/div[1]/div/div/div/div/div/div[1]/div/div/div[1]/div"
        );
        if (share.length > 0) {
          await share[0].click();
          await delay(3000);
        } else {
          throw new Error(
            "Share options not found. Please check your selector."
          );
        }
      }
      shareReels++;
      console.log(shareReels);
      // sau khi share thì click next, đảm bảo share đồng đều trong khoảng thời gian
      let elapsedWaitTime1 = 0;
      while (elapsedWaitTime1 < waitTimeBetweenPosts * 0.3) {
        await clickNext(page);
        await delay(5000);
        elapsedWaitTime1 += 5000;
      }
    } else {
      throw new Error("Share button not found. Please check your selector.");
    }
  }
}
try {
  const url = "https://www.facebook.com/";
  await navigateToUrl(page, url);
  await shareReels(page, 2, 1, 3);
} catch (error) {
  logErrors.push({
    error: "Error during share reels execution",
    detail: error.message,
  });
}
return logErrors;
