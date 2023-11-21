import delay from "../helpers/delay.js";
import { faker } from "@faker-js/faker";
async function upPost(page) {
    try {
        const postArea = await page.$x(
          "//div/div/div/div[1]/div[1]/div/div[2]/div/div/div/div[3]/div/div[2]/div/div/div/div[1]/div"
        );
        if(postArea.length > 0) {
            await postArea[0].click();
            await delay(2000);
            const content = faker.lorem.paragraphs(2);
            console.log(content);
            await page.keyboard.type(content)
            await delay(2000)
            const postButton = await page.$x(
              "//div/div/div/form/div/div[1]/div/div/div/div[3]/div[2]/div"
            );
            if(postButton.length > 0) {
                await delay(1000);
                await postButton[0].click();
            } else {
                console.log("can't find post button");
            }
        } else {
             console.log("Can't post status");
        }
    } catch(error) {
        log(error)
    }
}
export default upPost;