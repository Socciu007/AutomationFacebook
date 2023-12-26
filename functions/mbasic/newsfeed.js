import delay from "../../helpers/delay.js";
import scrollSmoothIfNotExistOnScreen from "../../helpers/scrollIfNotExist.js";
import checkExistElementOnScreen from "../../helpers/checkElementOnScreen.js";
import {
  getElement,
  getElements,
  getRandomInt,
  getRandomIntBetween,
  waitForNavigation,
} from "../../helpers/puppeteer.js";
import checkExistElement from "../../helpers/checkExistElement.js";

async function scroll(page, scrollingTime, delayTime) {
  let randomScrollTime = getRandomIntBetween(
    scrollingTime.start * 1000,
    scrollingTime.end * 1000
  );
  let scrollAmount = getRandomIntBetween(300, 500);
  let randomDelay = getRandomIntBetween(
    delayTime.start * 1000,
    delayTime.end * 1000
  );
  try {
    while (randomScrollTime > 0) {
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
      await delay(randomDelay);
      randomScrollTime = randomScrollTime - 1000;
    }
  } catch (error) {
    console.log(error);
  }
}
async function interactWithNewsfeed(
  page,
  scrollingTime,
  delayTime,
  randomLike,
  shareToFeed,
  randomComment
) {
  if (randomLike.isClicked == true) {
    let count = 0;
    let numLikes = getRandomIntBetween(randomLike.start, randomLike.end);
    while (count < numLikes) {
      try {
        await scroll(page, scrollingTime, delayTime);
        const result = await randomLikePost(page, delayTime);
        if (result != 0) {
          count++;
        }
      } catch (error) {
        console.log(error);
        break;
      }
    }
    console.log("Da like du bai");
  }

  if (shareToFeed.isClicked == true) {
    let count = 0;
    let numShares = getRandomIntBetween(shareToFeed.start, shareToFeed.end);
    while (count < numShares) {
      await scroll(page, scrollingTime, delayTime);
      const result = await share(page, delayTime);
      if (result != 0) {
        count++;
        console.log("Đã share được ", count, " bài");
      }
    }
    console.log(shareToFeed);
  }
  if (randomComment.isClicked == true) {
    const numComments = getRandomIntBetween(
      randomComment.start,
      randomComment.end
    );
    let count = 0;
    while (count < numComments) {
       await scroll(page, scrollingTime, delayTime);
      const result = await comment(page, randomComment.content, delayTime);
      if (result > 0) {
        count++;
        console.log("Đã share được ", count, " bài");
      }
      console.log(randomComment);
    }
  }
}
async function findReactBtn(page) {
  try {
    let hrefs = await page.$$eval("a", (links) => links.map((a) => a.href));
    if (hrefs.length > 0) {
      hrefs = hrefs.filter((e) => e.includes("/reactions/picker/"));
      const randomIndex = getRandomInt(hrefs.length);
      const href = hrefs[randomIndex];
      const reactSelector = `[href="${href.replace(
        "https://mbasic.facebook.com",
        ""
      )}"]`;
      const checkReactBtn = await checkExistElement(page, reactSelector, 3);
      if (checkReactBtn != 1) {
        throw new Error("Can't find react button");
      }
      await scrollSmoothIfNotExistOnScreen(page, reactSelector);
      const reactBtn = await getElement(page, reactSelector);
      if (reactBtn) {
        await reactBtn.click();
      }
    }
  } catch (error) {
    console.log(error);
  }
}
async function clickLike(page) {
  try {
    const selector = "#root > table > tbody > tr > td > ul > li:nth-child(1)";
    await delay(3000);
    const checkLikeBtn = await checkExistElement(page, selector, 3);
    console.log(checkLikeBtn);
    // đã like trước đó hay chưa
    const unlikeBtn =
      "#root > table > tbody > tr > td > ul > li:nth-child(1) > table > tbody > tr > td > a > div > table > tbody > tr > td:nth-child(3)";
    const checkUnlikeBtn = await checkExistElement(page, unlikeBtn, 5);
    if (checkUnlikeBtn) {
      console.log("đã like từ trước");
      const homeSelector = "#header > table > tbody > tr > td.l > a";
      const homeBtn = await getElement(page, homeSelector, 10);
      await homeBtn.click();
      return 0;
    }
    const likeBtn = await getElement(page, selector, 10);
    await likeBtn.click();
    console.log("Da click like");
    return 1;
  } catch (error) {
    console.log(error);
  }
}
async function randomLikePost(page, delayTime) {
  try {
    let count = 0;
    await findReactBtn(page);
    let randomDelay = getRandomIntBetween(delayTime.start, delayTime.end);
    await delay(randomDelay);
    const result = await clickLike(page);
    if (result != 0) {
      count++;
    }
    return count;
  } catch (error) {
    console.log(error);
  }
}
async function findShareBtn(page) {
  try {
    let hrefs = await page.$$eval("a", (links) => links.map((a) => a.href));
    if (hrefs.length > 0) {
      hrefs = hrefs.filter((e) => e.includes("/composer/mbasic/"));
      const randomIndex = getRandomInt(hrefs.length);
      const href = hrefs[randomIndex];
      const shareSelector = `[href="${href.replace(
        "https://mbasic.facebook.com",
        ""
      )}"]`;
      const checkShareBtn = await checkExistElement(page, shareSelector, 3);
      if (checkShareBtn != 1) {
        throw new Error("Can't find share button");
      }
      console.log("Co nut share");
      await scrollSmoothIfNotExistOnScreen(page, shareSelector);
      const shareBtn = await getElement(page, shareSelector);
      if (shareBtn) {
        await shareBtn.click();
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function clickShare(page) {
  try {
    const selector = 'input[name="view_post"]';
    await delay(3000);
    const checkShareBtn = await checkExistElement(page, selector, 3);
    if (checkShareBtn != 1) {
      throw new Error("Can't find share button");
    }
    const shareBtn = await getElement(page, selector, 10);
    await shareBtn.click();
    console.log("Da click share");

    const homeSelector =
      "#header > table > tbody > tr > td.s > table > tbody > tr > td > h1 > a";
    const homeBtn = await getElement(page, homeSelector, 10);
    if (!homeBtn) {
      throw new Error("Không thể về trang chủ");
    }
    await homeBtn.click();
    console.log("Đã click nút home");
    await delay(3000);
    return 1;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function share(page, delayTime) {
  try {
    let temp = 0;
    await findShareBtn(page);
    let randomDelay = getRandomIntBetween(delayTime.start, delayTime.end);
    await delay(randomDelay);
    const result = await clickShare(page);
    if (result != 0) {
      temp++;
      console.log("count:", temp);
    }
    return temp;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function comment(page, content, delayTime) {
  try {
    let temp = 0;
    await findCommentBtn(page);
    let randomDelay = getRandomIntBetween(delayTime.start, delayTime.end);
    await delay(randomDelay);
    await clickComment(page, content);
    let randomDelay1 = getRandomIntBetween(delayTime.start, delayTime.end);
    await delay(randomDelay1);
    const result = await clickPostComment(page);
    if (result == 1) {
      temp++;
    }
    return temp;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function findCommentBtn(page) {
  try {
     let hrefs = await page.$$eval("a", (links) => links.map((a) => a.href));
     if (hrefs.length > 0) {
       hrefs = hrefs.filter((e) => e.includes("/story.php?story_fbid"));
       const randomIndex = getRandomInt(hrefs.length);
       const href = hrefs[randomIndex];
       const commentSelector = `[href="${href.replace(
         "https://mbasic.facebook.com",
         ""
       )}"]`;
       const checkCommentBtn = await checkExistElement(page, commentSelector, 3);
       if (checkCommentBtn != 1) {
         throw new Error("Can't find comment button");
       }
       console.log("Co nut cpmment");
       await scrollSmoothIfNotExistOnScreen(page, commentSelector);
       const commentBtn = await getElement(page, commentSelector);
       if (commentBtn) {
         await commentBtn.click();
       }
     }
    return 1;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function clickComment(page, content) {
  const commentArea = 'textarea[id="composerInput"]';
  const checkCommentArea = await checkExistElement(page, commentArea, 3);
  if (checkCommentArea != 1) {
    throw new Error("Can't find area comment");
  }
  await scrollSmoothIfNotExistOnScreen(page, commentArea);
  await delay(3000);
  if (content.length > 0) {
    const randomIndex = getRandomInt(content.length);
    const text = content[randomIndex];
    await page.keyboard.type(text);
    console.log("đã nhập xong");
    await delay(1000);
  }
}
async function clickPostComment(page) {
  try {
    const postSelector = "#u_0_1_vn > tbody > tr > td.m > div > input";
    const checkPostBtn = await checkExistElement(page, postSelector, 3);
    if (checkPostBtn != 1) {
      throw new Error("Can't find post button");
    }
    await scrollSmoothIfNotExistOnScreen(page, postSelector);
    const postBtn = await getElement(page, postSelector, 10);
    await postBtn.click();
    console.log("Đã click nút Post");
    await delay(2000);
    const homeSelector =
      "#header > table > tbody > tr > td.s > table > tbody > tr > td > h1 > a";
    const homeBtn = await getElement(page, homeSelector, 10);
    if (!homeBtn) {
      throw new Error("Không thể về trang chủ");
    }
    await scrollSmoothIfNotExistOnScreen(page, homeSelector);
    await homeBtn.click();
    return 1;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export default interactWithNewsfeed;
