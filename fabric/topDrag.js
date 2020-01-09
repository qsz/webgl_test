// 顶点拖动改变形状
// 参考：
// 1. http://fabricjs.com/stickman
// 2. http://fabricjs.com/quadratic-curve

import { fabric } from "fabric";

const canvas = new fabric.Canvas("canvas");
fabric.Object.prototype.originX = fabric.Object.prototype.originY = "center";

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

canvas.on("object:moving", function(e) {
  var p = e.target;
  p.line1 && p.line1.set({ x2: p.left, y2: p.top });
  p.line2 && p.line2.set({ x1: p.left, y1: p.top });
  canvas.renderAll();
});

canvas.on("mouse:down", function(option) {
  // 监控页面的键盘事件
  document.onkeydown = function(e) {
    // 是否点击delete
    if (e.keyCode === 8) {
      // 移除当前所选对象
      canvas.remove(option.target);
    }
  };
});
