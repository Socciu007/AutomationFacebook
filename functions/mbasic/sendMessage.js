import checkExistElement from "../../helpers/checkExistElement.js";
import {
  clickElement,
  delay,
  getRandomIntBetween,
} from "../../helpers/puppeteer.js";
import { getElement } from "../../helpers/puppeteer.js";

async function sendMessage(page, numsProfiles) {
  const objSendMessage = {
    numsFriend: 2,
    waitTime: 15,
    // idFriend: ["100089185640748", "61554607452774"],
    message: ["Hello", "Hi"],
  };
  try {
    let countFriend = 0;
    const waitTimeMs = objSendMessage.waitTime * 1000;
    while (countFriend < objSendMessage.numsFriend) {
      // wait time before send msg
      const startTime = new Date();
      let currentTime = new Date();
      while (currentTime - startTime < waitTimeMs / numsProfiles) {
        currentTime = new Date();
      }

      // tim nut chat và click sang trang chat with friend
      let hrefsChat = await page.$$eval("a", links => links.map(a => a.href));
      if (hrefsChat.length > 0) {
        hrefsChat = hrefsChat.filter(e => e.includes("/buddylist"));
        const href = hrefsChat[0];
        const chatSelector = `[href="${href.replace(
          "https://mbasic.facebook.com",
          ""
        )}"]`;
        const checkChatBtn = await checkExistElement(page, chatSelector, 3);
        if (checkChatBtn != 1) {
          throw Error("Element chat is not exist");
        }
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
        if (objSendMessage.idFriend.length > 0) {
          hrefsSendMsg = await hrefsSendMsg.filter(e =>
            e.includes(objSendMessage.idFriend[countFriend])
          );
          if (hrefsSendMsg.length == 1) {
            const friendSpecialToChatSelector = `[href="${hrefsSendMsg[0].replace(
              "https://mbasic.facebook.com",
              ""
            )}"]`;
            const checkFriendSpecialToChatBtn = await checkExistElement(
              page,
              friendSpecialToChatSelector,
              3
            );
            if (checkFriendSpecialToChatBtn != 1) {
              throw Error("Element friend special to chat is not exist");
            }
            const friendSpecialToChatBtn = await getElement(
              page,
              friendSpecialToChatSelector
            );
            if (friendSpecialToChatBtn) {
              await friendSpecialToChatBtn.click();
            } else {
              throw Error("Can not click into chat with your special friend");
            }
          } else {
            throw Error("Your friend is not active");
          }
        } else {
          hrefsSendMsg = await hrefsSendMsg.filter(e =>
            e.includes("/messages/read")
          );
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
          const friendToChatBtn = await getElement(page, friendToChatSelector);
          if (friendToChatBtn) {
            await friendToChatBtn.click();
          } else {
            throw Error("Can not click into chat with your friend");
          }
        }
      } else {
        throw Error("No friend to send message");
      }
      await delay(getRandomIntBetween(3000, 5000));

      // select msg to send and send msg
      for (const msg of objSendMessage.message) {
        const inputMsgSelector = "table > tbody > tr > td > textarea";
        const checkExistInputMsg = await checkExistElement(
          page,
          inputMsgSelector,
          3
        );
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
export default sendMessage;
