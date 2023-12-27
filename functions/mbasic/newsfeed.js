import scrollSmoothIfNotExistOnScreen from "../../helpers/scrollIfNotExist.js";
import checkExistElementOnScreen from "../../helpers/checkElementOnScreen.js";
import {
  delay,
  getElement,
  getRandomInt,
  getRandomIntBetween,
  getElements,
} from "../../helpers/puppeteer.js";
import checkExistElement from "../../helpers/checkExistElement.js";

let newsfeed = {
  scrollTimeStart: 5,
  scrollTimeEnd: 10,
  delayTimeStart: 5,
  delayTimeEnd: 10,
  randomLike: false,
  likeStart: 5,
  likeEnd: 10,
  randomShare: false,
  shareStart: 1,
  shareEnd: 2,
  randomComment: false,
  commentStart: 1,
  commentEnd: 2,
  commentStrs: [],
};

async function interactWithNewsfeed(page, newsfeed) {
  if (newsfeed.randomLike == true) {
    let count = 0;
    let numLikes = getRandomIntBetween(newsfeed.likeStart, newsfeed.likeEnd);
    while (count < numLikes) {
      try {
        await scroll(page, newsfeed);
        const result = await randomLikePost(page, newsfeed);
        if (result != 0) {
          count++;
        }
      } catch (error) {
        console.log(error);
        break;
      }
    }
  }

  if (newsfeed.randomShare == true) {
    let count = 0;
    let numShares = getRandomIntBetween(
      newsfeed.shareStart,
      newsfeed.shareEnd
    );
    while (count < numShares) {
      await scroll(page, newsfeed);
      const result = await share(page, newsfeed);
      if (result != 0) {
        count++;
        console.log("Đã share được ", count, " bài");
      }
    }
  }

  if (newsfeed.randomComment.isClicked == true) {
    const numComments = getRandomIntBetween(
      newsfeed.commentStart,
      newsfeed.commentEnd
    );
    let count = 0;
    while (count < numComments) {
      await scroll(page, newsfeed);
      const result = await comment(
        page,
        newsfeed
      );
      if (result > 0) {
        count++;
        console.log("Đã comment được ", count, " bài");
      }
    }
  }
}

async function scroll(page, newsfeed) {
  let randomScrollTime = getRandomIntBetween(
   newsfeed.scrollTimeStart * 1000,
    newsfeed.scrollTimeEnd * 1000
  );
  let scrollAmount = getRandomIntBetween(300, 500);
  let randomDelay = getRandomIntBetween(
    newsfeed.delayTimeStart * 1000,
    newsfeed.delayTimeEnd * 1000
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
async function randomLikePost(page, newsfeed) {
  try {
    let count = 0;
    await findReactBtn(page);
    let randomDelay = getRandomIntBetween(newsfeed.delayTimeStart, newsfeed.delayTimeEnd);
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
async function share(page, newsfeed) {
  try {
    let temp = 0;
    await findShareBtn(page);
    let randomDelay = getRandomIntBetween(newsfeed.delayTimeStart, newsfeed.delayTimeEnd);
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
async function comment(page, newsfeed) {
  try {
    let temp = 0;
    await findCommentBtn(page);
    let randomDelay = getRandomIntBetween(newsfeed.delayTimeStart, newsfeed.delayTimeEnd);
    await delay(randomDelay);
    await clickComment(page, newsfeed.commentStrs);
    let randomDelay1 = getRandomIntBetween(newsfeed.delayTimeStart, newsfeed.delayTimeEnd);
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
      console.log("Co nut comment");
      await scrollSmoothIfNotExistOnScreen(page, commentSelector);
      const commentBtn = await getElement(page, commentSelector);
      if (commentBtn) {
        await commentBtn.click();
      }
      await delay(5000);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function clickComment(page, content) {
  const commentArea = 'textarea[name="comment_text"]';
  const checkCommentArea = await checkExistElement(page, commentArea, 5);
  console.log(checkCommentArea);
  if (checkCommentArea != 1) {
    throw new Error("Can't find area comment");
  }
  await scrollSmoothIfNotExistOnScreen(page, commentArea);
  await delay(3000);
  const textarea = await getElement(page, commentArea, 10);
  await textarea.click();
  if (content.length > 0) {
    const randomIndex = getRandomInt(content.length);
    const text = content[randomIndex];
    await page.keyboard.type(text);
    console.log("đã nhập xong");
    await delay(2000);
  }
}
async function clickPostComment(page) {
  try {
    const postSelector = "tbody > tr > td.m > div > input";
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
