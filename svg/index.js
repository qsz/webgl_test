// https://www.cnblogs.com/webhmy/p/9826120.html
// https://www.jianshu.com/p/1c88478b1bc8
// http://www.lulutx.com/html/2016/jqchajian_0104/23.html

import {SVG} from '@svgdotjs/svg.js'

var draw = SVG().addTo('body').size(1000, 1000)
var rect = draw.rect(100, 100).attr({ fill: '#f06' })

var line = draw.line(200, 300, 800, 950).stroke({ width: 5, linecap: "round", color: "blue" })

rect.addEventListener("click", function() {
    alert('圆形点击测试：');
});

