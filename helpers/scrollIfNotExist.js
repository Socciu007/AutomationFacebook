
import checkExistElementOnScreen from "./checkElementOnScreen.js";
async function scrollSmoothIfNotExistOnScreen(page, JSpath) {
  try {
    if ((await checkExistElementOnScreen(page, JSpath)) !== 0) {
      await page.evaluate((JSpath) => {
        document
          .querySelector(JSpath)
          .scrollIntoView({ behavior: "smooth", block: "center" });
      }, JSpath);
    }
    return 1;
  } catch (error) {
    return 0;
  }
}
export default scrollSmoothIfNotExistOnScreen;
