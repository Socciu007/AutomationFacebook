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

await delay(1000);
await page.goto("https://www.facebook.com/reel/", {
  waitUntil: "networkidle2",
});

async function clickNext(page) {
  const nextButton = await page.$x(
    "//div[1]/div/div[3]/div/div/div/div[1]/div[1]/div/div/div[1]/div/div/div/div/div/div[1]/div/div/div[3]"
  );
  if (nextButton.length > 0) {
    await delay(getRandomInt(5000, 7000));
    await nextButton[0].click();
  }
}
async function reactReels(page, numsLike, minDuration, maxDuration) {
  let likeReels = 0;
  const startTime = new Date();
  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // Random duration in milliseconds
  const waitTimeBetweenPosts = durationInMs / numsLike;
  try {
    while (Date.now() - startTime < durationInMs) {
      if (likeReels >= numsLike) {
        // Nếu đã like đủ bài, chỉ bấm Next
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
      const likeButton = await page.$x(
        "//div[2]/div[2]/div/div/div/div[2]/div/div/div/div[1]/div"
      );

      if (likeButton.length > 0) {
        // Attempt to comment on a post that hasn't been commented on yet
        await likeButton[0].click();
        await delay(getRandomInt(3000, 7000));
        if (Math.random() < 0.25) {
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
              console.log("không comment được");
            }
          } else {
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
              console.log("không comment được");
            }
          }
        } else {
          console.log("không comment");
        }
        likeReels++;
        await clickNext(page);
      } else {
        console.log("No likes buttons found, scrolling more...");
      }
    }
  } catch (error) {
    console.log(error);
  }
  console.log("Success");
}
await reactReels(page, 3, 1, 3);
await delay(30000);
