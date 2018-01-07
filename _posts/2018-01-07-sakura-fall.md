---
layout: post
title:  樱花下落动效
date:   2017-12-04
tags:
- 动画
- animate
---

看《春宵苦短，少女前进吧》的[动画官网](http://kurokaminootome.com/){:target="_blank"}时，觉得飘舞的樱花很好看，不禁看了下是怎么的实现的。

简单的说，就是在`canvas`上生成n个樱花花瓣，每一帧重新计算花瓣的位置。下面直接看[代码](http://kurokaminootome.com/js/jqeury.sakura.js){:target="_blank"}：

## 初始化

### 花瓣和风口

```javascript
var _sakuras = [];
var windRoots = [];

function setup() {
  addSakura();
  canvas.addEventListener('mousemove', function(e) {
    windRoots.push({x: e.clientX, y:e.clientY, rest:0});
  });
}

function addSakura() {
  for (var i=0; i < SAKURA_COUNT; ++i) {
    var sakura = {};

    sakura.scaleX = sakura.scaleY = Math.random() * 1.2 + 0.3;

    sakura.rotationX = Math.random() * 360;
    sakura.rotationY = Math.random() * 360;
    sakura.rotationZ = Math.random() * 360;

    sakura.x = Math.random() * 500;
    sakura.y = Math.random() * 500 - 500;
    sakura.z = Math.random() * 500;

    sakura.vx = 0.3 + 0.2 * Math.random();
    sakura.vy = 0.0 + 0.5 * Math.random();
    sakura.vz = 0.3 + 0.2 * Math.random();

    sakura.rotationVx = 7 - 10 * Math.random();
    sakura.rotationVy = 7 - 10 * Math.random();
    sakura.rotationVz = 7 - 10 * Math.random();

    _sakuras.push(sakura);
  }
}
```

风有坐标和强度（rest），类似于光源，用于之后计算花瓣运动的位置。每当鼠标移动会在鼠标位置生成一个风口，加上[节流函数（throttle）](http://underscorejs.org/#throttle){:target="_blank"}会更好。

花瓣对象包含了位置、放缩（scale）、旋转角度（rotation）、速度（v）的相关信息。

### 定时器

```javascript
var IMAGE_URL = 'images/sakura.png';

var _img = new Image();
_img.src = IMAGE_URL;
_img.onload = play;

function play(){
  setInterval(function(){
    draw();
  }, 1000 / 60);
}
```

当花瓣图片加载后开始定时计算花瓣位置。这里采用一秒60帧的固定频率计算，其实用[requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame){:target="_blank"}会更好。[^1]

### 主流程

```javascript
function draw(data){
  ++_cnt;

  _ctx.clearRect(0,0, CANVAS_WIDTH+1,CANVAS_HEIGHT+1);

  var len = _sakuras.length;
  for (var i=0; i < len; ++i) {
    fall(_sakuras[i]);
  }
  drawSakuras();
}
```

重置画布，对每片花瓣计算位置后，重新作画。

## 樱花下落

### 位置计算

```javascript
function fall(sakura) {
  sakura.rotationX += sakura.rotationVx + Math.random() * 5; 
  sakura.rotationY += sakura.rotationVy + Math.random() * 5;
  sakura.rotationZ += sakura.rotationVz + Math.random() * 5;
  var vx = sakura.vx + 1 * Math.abs(Math.sin(sakura.rotationZ * Math.PI / 180));
  var vy = sakura.vy + 1 * Math.abs(Math.cos(sakura.rotationX * Math.PI / 180));
  var vz = sakura.vz + 1 * Math.abs(Math.sin(sakura.rotationY * Math.PI / 180));

  var w = getNearWindRoot(sakura);
  if (w) {
    var kyori = getKyori(w.x, w.y, sakura.x, sakura.y);
    if (kyori <= 0) {
      vx += 3;
    } else {
      vx += (sakura.x - w.x) / kyori * (500 - sakura.z + 200) * 0.005 * Math.min(w.rest / 10, 1);
      vy += (sakura.y - w.y) / kyori * (500 - sakura.z + 200) * 0.005 * Math.min(w.rest / 10, 1);
    }
  }

  sakura.x += vx;
  sakura.y += vy;
  sakura.z -= vz;
  if(sakura.x > 500) {
    sakura.x = 0;
  }
  if(sakura.y > 500) {
    sakura.y = -100;
  }
  if(sakura.z < 0) {
    sakura.z = 500;
  }

  var scale = 1 / Math.max(sakura.z / 200, 0.001);
  sakura.scaleX = sakura.scaleY = scale;
}
```

樱花的大小为***500\*500***，其位置限制在***500\*600\*500***的长方体中，放缩的范围是[0.4, 1000]。

因为风的强度均为0，这里x和y方向的速度只有随机的增量，只有风口和花瓣重叠时x方向有一个很明显的加速度。

### 作画

```javascript
function drawSakuras() {
  var len = _sakuras.length;
  for (var i=0; i < len; ++i) {
    var s = _sakuras[i];
    var dispX = (s.x - 250) / Math.max(s.z / 200, 0.001) * 500 / 200 + 1000;
    var dispY = (s.y - 250) / Math.max(s.z / 200, 0.001) * 500 / 200 + 250;

    _ctx.translate(dispX, dispY);
    _ctx.scale(s.scaleX, s.scaleY);
    _ctx.rotate(s.rotationZ * Math.PI / 180);
    _ctx.transform(1, 0, 0, Math.sin(s.rotationX * Math.PI / 180), 0, 0);
    _ctx.translate(-dispX, -dispY);

    _ctx.drawImage(_img, dispX - IMG_SIZE / 2, dispY - IMG_SIZE / 2, IMG_SIZE, IMG_SIZE);

    _ctx.setTransform(1, 0, 0, 1, 0, 0);

  }
}
```

这里用到了很多[Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API){:target="_blank"}[^2]。

z轴的方向是向屏幕内，根据花瓣的z坐标放大了花瓣在画布上的坐标。

## 其他

看代码的注释，还有一些额外的效果并未体现。

### 风的强度

```javascript
function changeWind() {
  for (var i=0; i < windRoots.length; ++i) {
    windRoots[i].rest -= 1;
    if (windRoots[i].rest < 0) {
      windRoots.splice(i, 1);
      i -= 1
    }
  }
}
```

随着时间推移，风的强度不断减弱，直至消失。

### 光照

```javascript
function drawLight(s, alpha, dispX, dispY) {
  _ctx.translate(dispX, dispY);
  _ctx.scale(s.scaleX, s.scaleY);
  _ctx.rotate(s.rotationZ * Math.PI / 180);
  _ctx.transform(1, 0, 0, Math.sin(s.rotationX * Math.PI / 180), 0, 0);
  _ctx.translate(-dispX, -dispY);

  _ctx.globalAlpha = alpha * 0.2;
  _ctx.fillStyle = "rgb(255, 255, 255)";
  _ctx.beginPath();
  _ctx.arc(dispX, dispY, 7, 0, Math.PI * 2, true);
  _ctx.fill();
  _ctx.beginPath();
  _ctx.arc(dispX, dispY, 6, 0, Math.PI * 2, true);
  _ctx.fill();
  _ctx.beginPath();
  _ctx.arc(dispX, dispY, 5, 0, Math.PI * 2, true);
  _ctx.fill();

  _ctx.setTransform(1, 0, 0, 1, 0, 0);
}
```

用白色的透明扇面模拟花瓣上光的反射。

## 参考资料

[^1]: [Animating with javascript: from setInterval to requestAnimationFrame](https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/){:target="_blank"}
[^2]: 推荐可以随手翻看的手册，比如[Canvas Pocket Reference](http://shop.oreilly.com/product/0636920016045.do){:target="_blank"}