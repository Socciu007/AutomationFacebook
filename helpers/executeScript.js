import checkIsLive from "./checkIsLive.js";
async function executeScript(page, script) {
  try {
    // Kiểm tra xem trình duyệt có còn sống hay không
    if (!checkIsLive()) {
      return -2;
    }

    // Thực thi đoạn mã JavaScript trên trang web
    const result = await page.evaluate(script);

    // Trả về kết quả
    return result;
  } catch (error) {
    // Xử lý lỗi và xuất thông báo lỗi
    return error;
  }
}
export default executeScript;
