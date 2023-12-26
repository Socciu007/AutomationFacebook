import checkExistElement from "../../helpers/checkExistElement.js";
import {
  clickElement,
  delay,
  getRandomIntBetween,
} from "../../helpers/puppeteer.js";
import { getElement } from "../../helpers/puppeteer.js";

async function replyMessage(page, numsProfiles) {
  const objReplyMsg = {
    numsFriend: 3,
    waitTime: 15,
    message: ["Hello", "Hi"],
  };
  try {
    let countFriend = 0;
    const waitTimeMs = objReplyMsg.waitTime * 1000;

    while (countFriend < objReplyMsg.numsFriend) {
      //wait time before reply msg
      const startTime = new Date();
      let currentTime = new Date();
      while (currentTime - startTime < waitTimeMs / numsProfiles) {
        currentTime = new Date();
      }
      // tim nut message và click sang trang mesage to reply
      let hrefsMessages = await page.$$eval("a", links =>
        links.map(a => a.href)
      );
      if (hrefsMessages.length > 0) {
        hrefsMessages = hrefsMessages.filter(e => e.includes("/messages"));
        const href = hrefsMessages[0];
        const messagesSelector = `[href="${href.replace(
          "https://mbasic.facebook.com",
          ""
        )}"]`;
        const checkMessagesBtn = await checkExistElement(
          page,
          messagesSelector,
          3
        );
        if (checkMessagesBtn != 1) {
          throw Error("Element messages is not exist");
        }
        const messagesBtn = await getElement(page, messagesSelector);
        if (messagesBtn) {
          await messagesBtn.click();
        } else {
          throw Error("Can not click into messages");
        }
      }
      await delay(getRandomIntBetween(3000, 5000));
      // check sang trang chat ?
      let url = await page.url();
      if (!url.includes("/messages")) {
        throw Error("Messages page has not been loaded");
      }
      // chon ban be de gui tin nhan
      let hrefsSendMsg = await page.$$eval("a", links =>
        links.map(a => a.href)
      );
      if (hrefsSendMsg.length > 0) {
        hrefsSendMsg = await hrefsSendMsg.filter(e =>
          e.includes("/messages/read")
        );
        console.log("lenngth person send", hrefsSendMsg.length);
        const randomIndex = Math.floor(Math.random() * hrefsSendMsg.length);
        const href = hrefsSendMsg[randomIndex];
        const friendToChatSelector = `h3 > [href="${href.replace(
          "https://mbasic.facebook.com",
          ""
        )}"]`;
        const checkFriendToChatBtn = await checkExistElement(
          page,
          friendToChatSelector,
          3
        );
        if (checkFriendToChatBtn != 1) {
          throw Error("Element friend to reply is not exist");
        }
        const friendToChatBtn = await getElement(page, friendToChatSelector);
        if (friendToChatBtn) {
          await friendToChatBtn.click();
        } else {
          throw Error("Can not click into reply with your friend");
        }
      } else {
        throw Error("No friend to reply msg");
      }
      console.log("so ban chat", countFriend + 1);
      await delay(getRandomIntBetween(3000, 5000));
      // select msg to send and send msg
      for (const msg of objReplyMsg.message) {
        console.log("msg", msg);
        const inputMsgSelector = "table > tbody > tr > td > textarea";
        const checkExistInputMsg = await checkExistElement(
          page,
          inputMsgSelector,
          3
        );
        console.log("check", checkExistInputMsg);
        if (checkExistInputMsg != 1) {
          throw Error("no element exists to enter message");
        }
        await page.type(inputMsgSelector, msg);
        await delay(getRandomIntBetween(3000, 5000));
        const sendMsgSelector = 'table > tbody > tr > td > input[value="Send"]';
        const checkExistSendMsg = await checkExistElement(
          page,
          sendMsgSelector,
          3
        );
        if (checkExistSendMsg != 1) {
          throw Error("no element exists to send message");
        }
        await clickElement(page, sendMsgSelector);
        await delay(getRandomIntBetween(3000, 5000));
      }
      await delay(getRandomIntBetween(3000, 5000));
      console.log("Count friend send msg", countFriend + 1);
      countFriend++;
    }
  } catch (error) {
    throw Error(error.message);
  }
}
export default replyMessage;
