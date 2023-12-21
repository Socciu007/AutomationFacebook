import Promise from "bluebird";

export const delay = async function (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
};
export const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
export const getRandomIntBetween = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

export const getElementByID = async function (
  page,
  id,
  loop = 10,
  visible = false
) {
  let element;
  for (let i = 0; i < loop; i++) {
    try {
      element = await page.$('[id="' + id + '"]', { timeout: 1000, visible });
    } catch (error) {
      element = null;
    }
    if (element) return element;
    await delay(1000);
  }
};

export const clickElement = async function (page, selector) {
  await page.$eval(selector, (e) => e.click());
};

export const waitForNavigation = async (page, timeout = 60000) => {
  try {
    return await page.waitForNavigation({
      waitUntil: "networkidle0",
      timeout,
    });
  } catch (error) {
    return null;
  }
};
export const waitForNavigation2 = async function (page, timeout = 60000) {
  try {
    return await page.waitForNavigation({
      waitUntil: "networkidle2",
      timeout,
    });
  } catch (error) {
    return null;
  }
};
export const getAllText = async function (page) {
  try {
    const text = await page.$eval("*", (el) => el.innerText);
    return text;
  } catch (err) {
    return "";
  }
};

export const getText = async function (page, element) {
  try {
    const text = await page.evaluate((el) => el.innerText, element);
    return text;
  } catch (err) {
    return "";
  }
};

export const getElementByName = async function (page, name, loop = 10) {
  let element;
  for (let i = 0; i < loop; i++) {
    try {
      element = await page.$('[name="' + name + '"]', { timeout: 1000 });
    } catch (error) {
      element = null;
    }
    if (element) return element;
    await delay(1000);
  }
};

export const getElement = async function (page, selector, loop = 10) {
  let element;
  for (let i = 0; i < loop; i++) {
    try {
      element = await page.$(selector, { timeout: 1000 });
    } catch (error) {
      element = null;
    }
    if (element) return element;
    await delay(1000);
  }
};

export const getElements = async function (page, selector, loop = 10) {
  let elements;
  for (let i = 0; i < loop; i++) {
    try {
      elements = await page.$$(selector, { timeout: 1000 });
    } catch (error) {
      elements = null;
    }
    if (elements && elements.length) return elements;
    await delay(1000);
  }
};

export const getElementByClass = async function (page, name, loop = 10) {
  let element;
  for (let i = 0; i < loop; i++) {
    try {
      element = await page.$('[class="' + name + '"]', { timeout: 1000 });
    } catch (error) {
      element = null;
    }
    if (element) return element;
    await delay(1500);
  }
};
