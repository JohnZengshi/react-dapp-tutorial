/*
 * @LastEditors: John
 * @Date: 2024-01-09 09:34:24
 * @LastEditTime: 2024-01-15 13:00:12
 * @Author: John
 */

export default function flexible(
  window: Window,
  document: Document,
  isSmallScreenCallBack: (isSmall: boolean) => void
) {
  var docEl = document.documentElement;
  var dpr = window.devicePixelRatio || 1;

  // adjust body font size
  function setBodyFontSize() {
    if (document.body) {
      document.body.style.fontSize = 12 * dpr + "px";
    } else {
      document.addEventListener("DOMContentLoaded", setBodyFontSize);
    }
  }
  setBodyFontSize();

  // set 1rem = viewWidth / 10
  function setRemUnit() {
    if (docEl.clientWidth > 1024) {
      docEl.style.fontSize = "16px";
      isSmallScreenCallBack(false);
    } else {
      var rem = docEl.clientWidth / 10;
      // console.log("rem:", rem);
      docEl.style.fontSize = rem + "px";
      isSmallScreenCallBack(true);
    }
  }

  setRemUnit();

  // reset rem unit on page resize
  window.addEventListener("resize", setRemUnit);
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      setRemUnit();
    }
  });

  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement("body");
    var testElement = document.createElement("div");
    testElement.style.border = ".5px solid transparent";
    fakeBody.appendChild(testElement);
    docEl.appendChild(fakeBody);
    if (testElement.offsetHeight === 1) {
      docEl.classList.add("hairlines");
    }
    docEl.removeChild(fakeBody);
  }
}
