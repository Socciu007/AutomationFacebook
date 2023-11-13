import Hidemyacc from "./hidemyacc.js";

const hideMyAcc = new Hidemyacc();

(async () => {
 
  const profiles = await hideMyAcc.profiles();
  console.log(profiles);

  return;
})();
