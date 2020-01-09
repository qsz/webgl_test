/**
 * 1. 按住键盘的 Alt 键时，按下鼠标则可以移动画布
 * 2. 滚动鼠标滚轮，便会以鼠标位置为中心进行整个画布的放大和缩小（最大放大 3 倍，最小缩小到原来的 1/10）
 * 
 * 参考：
 * * [Fabric.js - 实现鼠标拖动画布、滚轮缩放画布的功能](https://www.hangge.com/blog/cache/detail_1860.html)
 * * [Fabric.js - 画布视图viewport的自适应（内容自动缩放并居中）](https://www.hangge.com/blog/cache/detail_1861.html)
 * * [滚轮事件](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/wheel_event)
 */

//是否拖动
let panning = false;

//鼠标按下
canvas.on("mouse:down", function(option) {
  //按住alt键才可拖动画布
  if (option.e.altKey) {
    panning = true;
    canvas.selection = false;
  }
});

//鼠标抬起
canvas.on("mouse:up", function(e) {
  panning = false;
  canvas.selection = true;
});

//鼠标移动
canvas.on("mouse:move", function(e) {
  if (panning && e && e.e) {
    var delta = new fabric.Point(e.e.movementX, e.e.movementY);
    canvas.relativePan(delta);
  }
});

/**
 * 跨浏览器监听滚动事件 - addWheelListener
 * @param {*} elem
 * @param {*} callback
 * @param {*} useCapture
 */
(function(window, document) {
  var prefix = "",
    _addEventListener,
    onwheel,
    support;

  // detect event model
  if (window.addEventListener) {
    _addEventListener = "addEventListener";
  } else {
    _addEventListener = "attachEvent";
    prefix = "on";
  }

  // detect available wheel event
  support =
    "onwheel" in document.createElement("div")
      ? "wheel" // 各个厂商的高版本浏览器都支持"wheel"
      : document.onmousewheel !== undefined
      ? "mousewheel" // Webkit 和 IE一定支持"mousewheel"
      : "DOMMouseScroll"; // 低版本firefox

  window.addWheelListener = function(elem, callback, useCapture) {
    _addWheelListener(elem, support, callback, useCapture);

    // handle MozMousePixelScroll in older Firefox
    if (support == "DOMMouseScroll") {
      _addWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
    }
  };

  function _addWheelListener(elem, eventName, callback, useCapture) {
    elem[_addEventListener](
      prefix + eventName,
      support == "wheel"
        ? callback
        : function(originalEvent) {
            !originalEvent && (originalEvent = window.event);

            // create a normalized event object
            var event = {
              // keep a ref to the original event object
              originalEvent: originalEvent,
              target: originalEvent.target || originalEvent.srcElement,
              type: "wheel",
              deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
              deltaX: 0,
              deltaZ: 0,
              preventDefault: function() {
                originalEvent.preventDefault
                  ? originalEvent.preventDefault()
                  : (originalEvent.returnValue = false);
              }
            };

            // calculate deltaY (and deltaX) according to the event
            if (support == "mousewheel") {
              event.deltaY = (-1 / 40) * originalEvent.wheelDelta;
              // Webkit also support wheelDeltaX
              originalEvent.wheelDeltaX &&
                (event.deltaX = (-1 / 40) * originalEvent.wheelDeltaX);
            } else {
              event.deltaY = originalEvent.detail;
            }

            // it's time to fire the callback
            return callback(event);
          },
      useCapture || false
    );
  }
})(window, document);

addWheelListener(document.querySelector(".upper-canvas"), () => {
  var zoom = (event.deltaY > 0 ? 0.1 : -0.1) + canvas.getZoom();  // >0:放大，每次放大缩小0.1倍
  zoom = Math.max(0.1, zoom); //最小为原来的1/10。 若 zoom = Math.max(1, zoom); 即最小为原来的1倍，即不缩小
  zoom = Math.min(3, zoom); //最大是原来的3倍
  var zoomPoint = new fabric.Point(event.pageX, event.pageY);
  canvas.zoomToPoint(zoomPoint, zoom);
});
