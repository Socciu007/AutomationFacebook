async function checkIsLive(page) {
  try {
    if (page && !page.isClosed()) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}
export default checkIsLive;
