// https://segmentfault.com/a/1190000017749198
// http://fabricjs.com/demos/
// http://fabricjs.com/controls-customization

import { fabric } from "fabric";

const canvas = new fabric.Canvas("canvas");
fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";

const bgRect = new fabric.Rect({
  left: 500, //距离画布左侧的距离，单位是像素
  top: 400, //距离画布上边的距离
  fill: "#FDF5E6", //填充的颜色
  width: 1000, //方形的宽度
  height: 800, //方形的高度
  selectable: false,
  evented: false
});
canvas.add(bgRect);

function makeCircle(left, top, line1, line2) {
  var c = new fabric.Circle({
    left: left,
    top: top,
    strokeWidth: 1,
    radius: 5,
    fill: "#fff",
    stroke: "#666"
  });
  c.hasControls = c.hasBorders = false;

  c.line1 = line1; // line终点
  c.line2 = line2; // line起点

  return c;
}

function makeLine(coords) {
  return new fabric.Line(coords, {
    fill: "red",
    stroke: "red",
    strokeWidth: 2,
    selectable: false,
    evented: false
  });
}

var line1 = makeLine([500, 200, 800, 200]),
  line2 = makeLine([800, 200, 800, 400]),
  line3 = makeLine([800, 400, 600, 600]),
  line4 = makeLine([600, 600, 500, 400]),
  line5 = makeLine([500, 400, 500, 200]);

canvas.add(line1, line2, line3, line4, line5);

canvas.add(
  makeCircle(line1.get("x1"), line1.get("y1"), line5, line1),
  makeCircle(line2.get("x1"), line2.get("y1"), line1, line2),
  makeCircle(line3.get("x1"), line3.get("y1"), line2, line3),
  makeCircle(line4.get("x1"), line4.get("y1"), line3, line4),
  makeCircle(line5.get("x1"), line5.get("y1"), line4, line5)
);

var rect = new fabric.Rect({
  left: 150,
  top: 200,
  originX: "left",
  originY: "top",
  width: 150,
  height: 120,
  angle: -10,
  fill: "rgba(255,0,0,0.5)",
  transparentCorners: false
});

canvas.add(rect);

//是否拖动
let panning = false;

canvas.on("object:click", function(e) {
  var p = e.target;
  p.line1 && p.line1.set({ x2: p.left, y2: p.top });
  p.line2 && p.line2.set({ x1: p.left, y1: p.top });
  canvas.renderAll();
});

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
  var zoom = (event.deltaY > 0 ? 0.1 : -0.1) + canvas.getZoom(); // >0:放大，每次放大缩小0.1倍
  zoom = Math.max(1, zoom); //最小为原来的1倍，即不缩小
  zoom = Math.min(3, zoom); //最大是原来的3倍

  if (zoom === 1 && canvas.getZoom() === 1) return;

  var zoomPoint = new fabric.Point(event.pageX, event.pageY);
  canvas.zoomToPoint(zoomPoint, zoom);
});
