import delay from "./delay.js";
async function clearText(page) {
  // Thực hiện chuỗi hành động
  try {
    await delay(2000);

    await page.keyboard.down("Control"); // Giữ phím Shift xuống
    console.log("presscontrol");
    await delay(1000);
    await page.keyboard.press("KeyA"); // Gửi phím ArrowUp
    console.log("pressA");
    await delay(1000);
    await page.keyboard.press("Delete"); // Gửi phím Delete
    console.log("pressDelete");
    await delay(1000);
    await page.keyboard.up("Control"); // Nhả phím Shift
    await delay(2000);
    return 1;
  } catch (error) {
    return error;
  }
}
export default clearText;
