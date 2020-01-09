// 删除所选对象

import { fabric } from "fabric";

const canvas = new fabric.Canvas("canvas");
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

canvas.on("mouse:down", function(option) {
  // 监控页面的键盘事件
  document.onkeydown = function(e) {
    // 是否点击delete
    console.log("e:", e.keyCode, option.target);
    if (e.keyCode === 46) {
      // 移除当前所选对象
      canvas.remove(option.target);
    }
  };
});
