const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function navigateToUrl(page, url) {
  try {
    await page.goto(url, {
      waitUntil: "networkidle2",
    });
  } catch (error) {
    throw new Error(`Error navigating to URL: ${url}. ${error.message}`);
  }
}

let logErrors = [];
async function addFriend(page, numFriends) {
  // click friends
  const friendButton = await page.$('a[href="/friends/"]');
  if (friendButton == null) {
    throw new Error("Friend button not found. Please check your selector.");
  }
  await friendButton.click();
  await delay(3000);
  // Lướt một quãng thời gian trước khi thực hiện click
  let elapsedWaitTime = 0;
  while (elapsedWaitTime < 10000) {
    await page.mouse.wheel({ deltaY: getRandomInt(500, 700) });
    await delay(5000);
    elapsedWaitTime += 2000;
  }

  let numsAdd = 0;
  let addButtons = await page.$$(
    'div[class="x1n2onr6 x1ja2u2z x78zum5 x2lah0s xl56j7k x6s0dn4 xozqiw3 x1q0g3np xi112ho x17zwfj4 x585lrc x1403ito x972fbf xcfux6l x1qhh985 xm0m39n x9f619 xn6708d x1ye3gou x1hr4nm9 x1r1pt67"]'
  );
  if (addButtons == null) {
    throw new Error("Can't find any add buttons. Please check your selector.");
  }
  while (numsAdd < numFriends) {
    let randomIndex = Math.floor(Math.random() * addButtons.length);
    let addButton = addButtons[randomIndex];
    await delay(5000);
    if (addButton == null) {
      throw new Error("Add button not found. Please check your selector.");
    }
    await addButton.click();
    await delay(5000);
    numsAdd++;
  }
}
try {
  const url = "https://www.facebook.com/";
  await navigateToUrl(page, url);
  await addFriend(page, 3);
} catch (error) {
  logErrors.push({
    error: "Error during add friend execution",
    detail: error.message,
  });
}
return logErrors;
