import delay from "../helpers/delay";
async function upPost(page) {
    try {
        const postArea = await page.$x(
          "//div/div/div/div[1]/div[1]/div/div[2]/div/div/div/div[3]/div/div[2]/div/div/div/div[1]/div"
        );
        if(postArea) {
            await postArea.click();
            await delay(2000)
        } else {
             console.log("Can't post status");
        }
    } catch(error) {
        log(error)
    }
}
export default upPost;