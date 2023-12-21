async function scrollSmooth(page, JSpath) {
  if (!checkIsLive()) {
    return -2;
  }

  try {
    await page.evaluate((JSpath) => {
      document
        .querySelector(JSpath)
        .scrollIntoView({ behavior: "smooth", block: "center" });
    }, JSpath);

    return 1;
  } catch (error) {
    return 0;
  }
}
export default scrollSmooth;
