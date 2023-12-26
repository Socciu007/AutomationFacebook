// import "./style.css";
// UPDATE: I was able to get this working again... Enjoy!
export default function createElementFromHTML(htmlString) {
  let temp = document.createElement("template");
  temp.innerHTML = htmlString.trim();
  return temp.content.firstChild;
}

var cursorinner = document.querySelector(".cursor2");

if (cursorinner) {
  // cursorinner.style.left = x + 'px';
  // cursorinner.style.top = y + 'px';
  // cursorinner.style.zIndex = 9999999999;
  // cursorinner.style.position= 'fixed';
} else {
  cursorinner = document.createElement("div");
  cursorinner.classList.add("cursor2");

  const icon =
    createElementFromHTML(`<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256"
      style="fill:#000000;">
      <g transform="translate(-51.2,-51.2) scale(1.4,1.4)"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.33333,5.33333)"><path d="M27.8,39.7c-0.1,0 -0.2,0 -0.4,-0.1c-0.2,-0.1 -0.4,-0.3 -0.6,-0.5l-3.7,-8.6l-4.5,4.2c-0.1,0.2 -0.3,0.3 -0.6,0.3c-0.1,0 -0.3,0 -0.4,-0.1c-0.3,-0.1 -0.6,-0.5 -0.6,-0.9v-22c0,-0.4 0.2,-0.8 0.6,-0.9c0.1,-0.1 0.3,-0.1 0.4,-0.1c0.2,0 0.5,0.1 0.7,0.3l16,15c0.3,0.3 0.4,0.7 0.3,1.1c-0.1,0.4 -0.5,0.6 -0.9,0.7l-6.3,0.6l3.9,8.5c0.1,0.2 0.1,0.5 0,0.8c-0.1,0.2 -0.3,0.5 -0.5,0.6l-2.9,1.3c-0.2,-0.2 -0.4,-0.2 -0.5,-0.2z" fill="#ffffff"></path><path d="M18,12l16,15l-7.7,0.7l4.5,9.8l-2.9,1.3l-4.3,-9.9l-5.6,5.1v-22M18,10c-0.3,0 -0.5,0.1 -0.8,0.2c-0.7,0.3 -1.2,1 -1.2,1.8v22c0,0.8 0.5,1.5 1.2,1.8c0.3,0.2 0.6,0.2 0.8,0.2c0.5,0 1,-0.2 1.4,-0.5l3.4,-3.2l3.1,7.3c0.2,0.5 0.6,0.9 1.1,1.1c0.2,0.1 0.5,0.1 0.7,0.1c0.3,0 0.5,-0.1 0.8,-0.2l2.9,-1.3c0.5,-0.2 0.9,-0.6 1.1,-1.1c0.2,-0.5 0.2,-1.1 0,-1.5l-3.3,-7.2l4.9,-0.4c0.8,-0.1 1.5,-0.6 1.7,-1.3c0.3,-0.7 0.1,-1.6 -0.5,-2.1l-16,-15c-0.3,-0.5 -0.8,-0.7 -1.3,-0.7z" fill="#01162b"></path></g></g></g>
      </svg>`);

  cursorinner.appendChild(icon);
  document.body.appendChild(cursorinner);
  console.log(cursorinner);
  document.addEventListener("mousemove", function (e) {
    var x = e.clientX;
    var y = e.clientY;
    cursorinner.style.left = x + "px";
    cursorinner.style.top = y + "px";
    cursorinner.style.zIndex = 9999999999;
    cursorinner.style.position = "fixed";
  });

  document.addEventListener("mousedown", function () {
    cursorinner.classList.add("cursorinnerhover");
  });

  document.addEventListener("mouseup", function () {
    cursorinner.classList.remove("cursorinnerhover");
  });
}
