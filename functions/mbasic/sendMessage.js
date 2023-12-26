import checkExistElement from "../../helpers/checkExistElement.js";
import { clickElement, delay, getRandomIntBetween } from "../../helpers/puppeteer.js";
import { getElement } from "../../helpers/puppeteer.js";
import scrollSmoothIfNotExistOnScreen from "../../helpers/scrollIfNotExist.js";

async function sendMessage(page, numsFriend, waitTime, message = []) {
  try {
    let countFriend = 0;
    const waitTimeMs = waitTime*1000;
    while ( countFriend < numsFriend) {
      const startTime = new Date();
      let currentTime = new Date();
      while (currentTime - startTime < waitTimeMs) {
        console.log("time", currentTime - startTime);
        currentTime = new Date();
      }
      // tim nut chat và click sang trang chat with friend
      let hrefsChat = await page.$$eval("a", links => links.map(a => a.href));
      if (hrefsChat.length > 0) {
        hrefsChat = hrefsChat.filter(e => e.includes("/buddylist"));
        console.log('length chat', hrefsChat.length);
        const href = hrefsChat[0];
        const chatSelector = `[href="${href.replace(
          "https://mbasic.facebook.com",
          ""
        )}"]`;
        const checkChatBtn = await checkExistElement(page, chatSelector, 3);
        if (checkChatBtn != 1) {
          throw Error("Element chat is not exist");
        }
        await scrollSmoothIfNotExistOnScreen(page, chatSelector);
        const chatBtn = await getElement(page, chatSelector);
        if (chatBtn) {
          await chatBtn.click();
        } else {
          throw Error("Can not click into chat");
        }
      }
      await delay(getRandomIntBetween(3000, 5000));
      // check sang trang chat ?
      let url = await page.url();
      if (!url.includes("/buddylist")) {
        throw Error("Chat page has not been loaded");
      }
      // chon ban be de gui tin nhan
      let hrefsSendMsg = await page.$$eval("a", links =>
        links.map(a => a.href)
      );
      if (hrefsSendMsg.length > 0) {
        hrefsSendMsg = await hrefsSendMsg.filter(e =>
            e.includes("/messages/read")
        );
        console.log('lenngth person send', hrefsSendMsg.length);
        const randomIndex = Math.floor(Math.random() * hrefsSendMsg.length);
        const href = hrefsSendMsg[randomIndex];
        const friendToChatSelector = `[href="${href.replace(
          "https://mbasic.facebook.com",
          ""
        )}"]`;
        const checkFriendToChatBtn = await checkExistElement(
          page,
          friendToChatSelector,
          3
        );
        if (checkFriendToChatBtn != 1) {
          throw Error("Element friend to chat is not exist");
        }
        // await scrollSmoothIfNotExistOnScreen(page, notiDetailsSelector);
        const friendToChatBtn = await getElement(page, friendToChatSelector);
        if (friendToChatBtn) {
          await friendToChatBtn.click();
        } else {
          throw Error("Can not click into chat with your friend");
        }
      }
      await delay(getRandomIntBetween(3000, 5000));
      // select msg and send msg
      for (const msg of message) {
          console.log('msg', msg);
          const inputMsgElement = 'table > tbody > tr > td > textarea'
          await page.type(inputMsgElement, msg);
          await delay(getRandomIntBetween(3000, 5000))
          const sendMsgElement = 'table > tbody > tr > td > input[value="Send"]'
          await clickElement(page, sendMsgElement)
          await delay(getRandomIntBetween(3000, 5000))
      }
      
      await delay(getRandomIntBetween(3000, 5000))
      console.log("Count friend send msg", countFriend + 1);
      countFriend++;
    }
  } catch (error) {
    throw Error(error.message)
  }
}
export default sendMessage;
