import delay from "../../helpers/delay.js";
async function addFriend(page, numFriends) {

 let numsAdd = 0;
 while(numsAdd < numFriends){
const addButtons = await page.$$(
  'div[class="x1n2onr6 x1ja2u2z x78zum5 x2lah0s xl56j7k x6s0dn4 xozqiw3 x1q0g3np xi112ho x17zwfj4 x585lrc x1403ito x972fbf xcfux6l x1qhh985 xm0m39n x9f619 xn6708d x1ye3gou xtvsq51 x1r1pt67"]'
);

if (addButtons.length > 0) {
  for (let i = 0; i < numFriends; i++) {
    const randomIndex = Math.floor(Math.random() * addButtons.length);
    const addButton = addButtons[randomIndex];

    // Scroll tới vị trí của button trước khi click
    await addButton.evaluate((button) => {
      button.scrollIntoView();
    });
    await delay(5000);
    await addButton.click();
    numsAdd++;
    console.log("Add successfully");
    await delay(3000);
  }
} else {
  console.log("Không tìm thấy button nào.");
  const scrollAmount = getRandomInt(500, 1000);
  await page.mouse.wheel({ deltaY: scrollAmount });
}
}
  
}

export default addFriend;
