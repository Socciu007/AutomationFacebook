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
  }
}
async function reactReels(page, numsLike, minDuration, maxDuration) {
  let likeReels = 0;
  const startTime = new Date();
  const count =0;
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
      if(count == 0) {
      let elapsedWaitTime = 0;
      while (elapsedWaitTime < durationInMs*0.3) {
        await clickNext(page);
        await delay(getRandomInt(3000, 7000));
        elapsedWaitTime += 5000;
      }
      }
      count++;
      // Find all the like buttons currently visible
      const likeButton = await page.$x(
        "//div[2]/div[2]/div/div/div/div[2]/div/div/div/div[1]/div"
      );

      if (likeButton.length > 0) {
        // Attempt to comment on a post that hasn't been commented on yet
        await likeButton[0].click();
        await delay(getRandomInt(3000, 7000));
        likeReels++;
        let elapsedWaitTime1 = 0;
        while (elapsedWaitTime1 < waitTimeBetweenPosts) {
          await clickNext(page)
          elapsedWaitTime1 += 5000;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
  console.log("Success");
}
await reactReels(page, 3, 1, 3);
await delay(30000);
