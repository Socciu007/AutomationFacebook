// async function checkExistElementOnScreen(page, JSpath) {
//   const element = await page.$(JSpath);
//   return element ? true : false;
// }

// var check = "";
// x = document.querySelector(
//   "#mbasic-composer-form > table > tbody > tr > td:nth-child(3) > div > input"
// );
// if (x.getBoundingClientRect().top <= 0) {
//   check = "-1";
// } else if (
//   x.getBoundingClientRect().top + x.getBoundingClientRect().height >
//   window.innerHeight
// ) {
//   check = "1";
// } else {
//   check = "0";
// }
// return check;

async function checkExistElementOnScreen(page, JSpath) {
  try {
    const element = await page.$eval(JSpath, (el) => {
      if (el.getBoundingClientRect().top <= 0) {
        return -1;
      } else if (
        el.getBoundingClientRect().top + el.getBoundingClientRect().height >
        window.innerHeight
      ) {
        return 1;
      } else {
        return 0;
      }
    });
    return element;
  } catch (error) {
    return error;
  }
}

export default checkExistElementOnScreen;
