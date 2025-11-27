"use strict";

var customRules = document.location.pathname !== "/";

function isClicking() {
  document.body.classList.add('user-is-clicking');
  document.body.classList.remove('user-is-tabbing');
}

function isTabbing(e) {
  var keyCode = e.keyCode || e.which;

  if (keyCode === 9) {
    document.body.classList.add('user-is-tabbing');
    document.body.classList.remove('user-is-clicking');
  }
}

document.onmousedown = isClicking;
document.onkeydown = isTabbing;
var previousElementOffsetTop = 0;

Element.prototype.documentOffsetTop = function () {
  return this.offsetTop + (this.offsetParent ? this.offsetParent.documentOffsetTop() : 0);
};

Element.prototype.scrollIntoCustomPosition = function () {
  var documentOffsetTop = this.documentOffsetTop();
  var customOffset = 0;

  if (document.activeElement.classList.contains('timeline')) {
    customOffset = 200;
  }

  var resultPosition = documentOffsetTop - window.innerHeight / 2 - customOffset;

  if (Math.abs(previousElementOffsetTop - documentOffsetTop) > 100) {
    window.scrollTo(0, resultPosition);
  }

  previousElementOffsetTop = documentOffsetTop;
};

function jumpFocusAlt(e) {
  var keyCode = e.keyCode || e.which;

  if (keyCode === 9 && customRules) {
    if (document.body.classList.contains('user-is-tabbing')) {
      document.activeElement.scrollIntoCustomPosition();
    }
  }
}

window.addEventListener('keyup', jumpFocusAlt);
