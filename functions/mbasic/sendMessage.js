import checkExistElement from "../../helpers/checkExistElement.js";
import {
  clickElement,
  delay,
  getRandomInt,
  getRandomIntBetween,
} from "../../helpers/puppeteer.js";
import { getElement } from "../../helpers/puppeteer.js";
import scrollSmoothIfNotExistOnScreen from "../../helpers/scrollIfNotExist.js";

async function sendMessage(page, numsProfiles) {
  const objSendMessage = {
    numsFriendStart: 2,
    numsFriendEnd: 5,
    waitTime: 15,
    // idFriend: ["61554607452774", "100089185640748"],
    idFriend: [],
    message: ["Hello", "Hi"],
  };
  try {
    let countFriend = 0;
    const numsFriendRandom = getRandomIntBetween(
      objSendMessage.numsFriendStart,
      objSendMessage.numsFriendEnd
    );
    const numsFriend =
      objSendMessage.idFriend.length !== 0
        ? objSendMessage.idFriend.length
        : numsFriendRandom;
    const waitTimeMs = objSendMessage.waitTime * 1000;
    while (countFriend < numsFriend) {
      // wait time before send msg
      const startTime = new Date();
      let currentTime = new Date();
      while (currentTime - startTime < waitTimeMs / numsProfiles) {
        currentTime = new Date();
      }

      // tim nut chat và click sang trang chat with friend
      if (objSendMessage.idFriend.length == 0) {
        // access chat page
        let hrefs = await page.$$eval("a", links => links.map(a => a.href));
        if (hrefs.length > 0) {
          const hrefPage = hrefs.filter(e => e.includes("/buddylist"));
          await accessPageByHref(page, hrefPage, 0, "chat page");
        } else {
          throw Error("No link to access to chat page");
        }

        // check sang trang chat ?
        let url = await page.url();
        if (!url.includes("/buddylist")) {
          throw Error("Chat page has not been loaded");
        }

        //access to friend to send msg
        hrefs = await page.$$eval("a", links => links.map(a => a.href));
        if (hrefs.length > 0) {
          const hrefPage = hrefs.filter(e => e.includes("/messages/read"));
          const indexHref = getRandomInt(hrefPage.length);
          await accessPageByHref(
            page,
            hrefPage,
            indexHref,
            "friend to chat page"
          );
        } else {
          throw Error("No friend to send message");
        }

        // select msg to send and send msg
        await sendMsg(
          page,
          objSendMessage.message,
          "table > tbody > tr > td > textarea",
          'table > tbody > tr > td > input[value="Send"]'
        );
      } else {
        // access profile page
        let hrefs = await page.$$eval("a", links => links.map(a => a.href));
        if (hrefs.length > 0) {
          const hrefPage = hrefs.filter(
            e =>
              e.includes("/profile") &&
              e.includes("header") &&
              e.includes("home")
          );
          await accessPageByHref(page, hrefPage, 0, "profile page");
        } else {
          throw Error("No link to access to profile page");
        }

        // access friend page
        hrefs = await page.$$eval("a", links => links.map(a => a.href));
        if (hrefs.length > 0) {
          const hrefPage = hrefs.filter(
            e => e.includes("v=friends") && e.includes("/profile")
          );
          await accessPageByHref(page, hrefPage, 0, "friends page");
        } else {
          throw Error("No link to access to friend page");
        }

        //find special friend to send msg
        hrefs = await page.$$eval("a", links => links.map(a => a.href));
        if (hrefs.length > 0) {
          let hrefPage = hrefs.filter(e =>
            e.includes(objSendMessage.idFriend[countFriend])
          );

          if (hrefPage.length == 1) {
            //select special friend
            const clickSelector = `[href="${hrefPage[0].replace(
              "https://mbasic.facebook.com",
              ""
            )}"]`;
            const findSpecialFriendBtn = await scrollSmoothIfNotExistOnScreen(
              page,
              clickSelector
            );
            if (findSpecialFriendBtn == 1) {
              await accessPageByHref(page, hrefPage, 0, "special friends");
            }

            // access message of special friend page
            hrefs = await page.$$eval("a", links => links.map(a => a.href));
            const hrefMsgOfSpecialFriendPage = hrefs.filter(e =>
              e.includes("/messages/thread")
            );
            await accessPageByHref(
              page,
              hrefMsgOfSpecialFriendPage,
              0,
              "message"
            );

            // select msg to send and send msg
            await sendMsg(
              page,
              objSendMessage.message,
              "table > tbody > tr > td > textarea",
              'table > tbody > tr > td > input[value="Send"]'
            );
          }

          while (hrefPage.length == 0) {
            const moreFriendSelector = "#m_more_friends > a > span";
            const findMoreFriendBtn = await scrollSmoothIfNotExistOnScreen(
              page,
              moreFriendSelector
            );
            if (findMoreFriendBtn == 1) {
              await clickElement(page, moreFriendSelector);
            }
            await delay(getRandomIntBetween(3000, 5000));

            hrefs = await page.$$eval("a", links => links.map(a => a.href));
            hrefPage = hrefs.filter(e =>
              e.includes(objSendMessage.idFriend[countFriend])
            );
            const clickSelector = `[href="${hrefPage[0].replace(
              "https://mbasic.facebook.com",
              ""
            )}"]`;
            const findSpecialFriendBtn = await scrollSmoothIfNotExistOnScreen(
              page,
              clickSelector
            );

            if (findSpecialFriendBtn == 1) {
              await accessPageByHref(page, hrefPage, 0, "special friends");
            }

            // access message of special friend page
            hrefs = await page.$$eval("a", links => links.map(a => a.href));
            const hrefMsgOfSpecialFriendPage = hrefs.filter(e =>
              e.includes("/messages/thread")
            );
            await accessPageByHref(
              page,
              hrefMsgOfSpecialFriendPage,
              0,
              "message"
            );

            // select msg to send and send msg
            await sendMsg(
              page,
              objSendMessage.message,
              "table > tbody > tr > td > textarea",
              'table > tbody > tr > td > input[value="Send"]'
            );
            await delay(getRandomIntBetween(3000, 5000));
          }
        } else {
          throw Error(
            "You do not have any friends yet. Please add more friends"
          );
        }
      }

      await delay(getRandomIntBetween(3000, 5000));
      console.log("Count friend send msg", countFriend + 1);
      countFriend++;
    }
  } catch (error) {
    throw Error(error.message);
  }
}

async function accessPageByHref(page, hrefPage, indexHref, namePage) {
  try {
    const clickSelector = `[href="${hrefPage[indexHref].replace(
      "https://mbasic.facebook.com",
      ""
    )}"]`;

    //check click button
    const checkClickBtn = await checkExistElement(page, clickSelector, 3);
    if (checkClickBtn != 1) {
      throw Error(`Element ${namePage} is not exist`);
    }
    //get button to click
    const clickBtn = await getElement(page, clickSelector);
    if (clickBtn) {
      await clickBtn.click();
    } else {
      throw Error(`Can not click into ${namePage}`);
    }
    await delay(getRandomIntBetween(3000, 5000));
  } catch (error) {
    console.log(error.message);
  }
}

async function sendMsg(page, objMsg, inputSelector, sendSelector) {
  for (const msg of objMsg) {
    const checkExistInputMsg = await checkExistElement(page, inputSelector, 3);
    if (checkExistInputMsg != 1) {
      throw Error("no element exists to enter message");
    }
    await page.type(inputSelector, msg);
    await delay(getRandomIntBetween(3000, 5000));

    const checkExistSendMsg = await checkExistElement(page, sendSelector, 3);
    if (checkExistSendMsg != 1) {
      throw Error("no element exists to send message");
    }
    await clickElement(page, sendSelector);
    await delay(getRandomIntBetween(3000, 5000));

    //random wait time to send next messages
    const startTimeSendMsg = new Date();
    let currentTimeSendMsg = new Date();
    while (
      currentTimeSendMsg - startTimeSendMsg <
      getRandomIntBetween(5000, 10000)
    ) {
      currentTimeSendMsg = new Date();
    }
    await delay(getRandomIntBetween(3000, 5000));
  }
}
export default sendMessage;
