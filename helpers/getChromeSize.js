async function getSizeChrome(page) {
  try {
    // Kiểm tra xem trình duyệt có còn sống hay không
    // if (!checkIsLive()) {
    //   return { x: 0, y: 0 };
    // }

    // Thực thi đoạn mã JavaScript để lấy kích thước của trình duyệt
    const sizeText = await page.evaluate(() => {
      return window.innerHeight + "|" + window.innerWidth;
    });

    // Chuyển đổi kết quả thành Point
    const sizeArray = sizeText.split("|");
    const result = { x: parseInt(sizeArray[1]), y: parseInt(sizeArray[0]) };

    return result;
  } catch (error) {
    // return { x: 0, y: 0 };
    return error;
  }
}
export default getSizeChrome;
