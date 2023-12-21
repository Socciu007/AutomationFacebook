import { delay } from "../../helpers/puppeteer.js";
import checkExistElementOnScreen from "../../helpers/checkElementOnScreen.js";
import scrollSmoothIfNotExistOnScreen from "../../helpers/scrollIfNotExist.js";
import checkIsLive from "../../helpers/checkIsLive.js";
import getRandomInt from "../../helpers/randomInt.js";
import checkExistElement from "../../helpers/checkExistElement.js";
import { getElements } from "../../helpers/puppeteer.js";
import { getElement } from "../../helpers/puppeteer.js";
async function likeRandom(page, numLikes, minDuration, maxDuration) {
  let count = 0;
  let startTime = new Date();
  if (checkIsLive(page) == false) return -2;

  const durationInMs =
    (Math.random() * (maxDuration - minDuration) + minDuration) * 60000; // chọn 1 mốc thời gian để dừng trong khoảng min và max
  // Tính toán thời gian chờ giữa mỗi lần chia sẻ
  const waitTimeBetweenPosts = durationInMs / numLikes;
  // scroll random before starting
  const scrollAmount = getRandomInt(300, 700);
  await page.mouse.wheel({ deltaY: scrollAmount });
  await delay(5000);
  try {
    while (Date.now() - startTime < durationInMs) {
      if (count >= numLikes) {
        console.log("đã like đủ bài");
        await page.mouse.wheel({ deltaY: scrollAmount });
            const moreNews = await checkExistElementOnScreen(
            page,
            "#m_news_feed_stream > a"
          );
          if (moreNews == 0) {
            const moreNewsBtn = await getElement(
              page,
              "#m_news_feed_stream > a",
              10
            );
            await moreNewsBtn.click();
            continue;
          }
      }
      await delay(5000);
      let hrefs = await page.$$eval("a", (links) => links.map((a) => a.href));
      if (hrefs.length > 0) {
        hrefs = hrefs.filter((e) => e.includes("/reactions/picker/"));
        const randomIndex = Math.floor(Math.random() * hrefs.length);
        const href = hrefs[randomIndex];
        const reactSelector = `[href="${href.replace(
          "https://mbasic.facebook.com",
          ""
        )}"]`;
        const checkReactBtn = await checkExistElement(page, reactSelector, 3);
        if (checkReactBtn != 1) {
          break;
        }
        await scrollSmoothIfNotExistOnScreen(page, reactSelector);
        const reactBtn = await getElement(page, reactSelector);
        if (reactBtn) {
          await reactBtn.click();
        }

        await delay(3000);
        if (checkIsLive(page) == false) break;
        // Tìm nút like
        const selector =
          "#root > table > tbody > tr > td > ul > li:nth-child(1)";
        const checkLikeBtn = await checkExistElement(page, selector, 3);
        if (checkLikeBtn != 1) {
          console.log("Can't find like button");
          break;
        }
        // đã like trước đó hay chưa
        const unlikeBtn =
          "#root > table > tbody > tr > td > ul > li:nth-child(1) > table > tbody > tr > td > a > div > table > tbody > tr > td:nth-child(3)";
        const checkUnlikeBtn = await checkExistElement(page, unlikeBtn, 3);
        if (checkUnlikeBtn) {
          console.log("đã like từ trước");
          const homeSelector = "#header > table > tbody > tr > td.l > a";
          const homeBtn = await getElement(page, homeSelector, 10);
          await homeBtn.click();
          continue;
        }
        const likeBtn = await getElement(page, selector, 10);
        await likeBtn.click();
        console.log("đã click like");
        await delay(5000);
        count++;
        let elapsedWaitTime = 0;
        while (elapsedWaitTime < waitTimeBetweenPosts * 0.5) {
          await page.mouse.wheel({ deltaY: getRandomInt(100, 300) });
          const moreNews = await checkExistElementOnScreen(
            page,
            "#m_news_feed_stream > a"
          );
          if (moreNews == 0) {
            const moreNewsBtn = await getElement(
              page,
              "#m_news_feed_stream > a",
              10
            );
            await moreNewsBtn.click();
            continue;
          }
          const randomTime = getRandomInt(1000, 2000);
          await delay(randomTime);
          elapsedWaitTime += randomTime;
        }
        console.log("đã scroll, tiếp tục like");
      } else {
        console.log("cant find");
        break;
      }
    }
  } catch (error) {
    console.log(error);
  }
}
export default likeRandom;
