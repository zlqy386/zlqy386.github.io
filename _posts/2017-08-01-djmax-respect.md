---
layout: post
title:  网页学习——DJMAX RESPECT
date:   2017-08-01
lastUpdate: 2019-02-18
tags:
- 网页学习
- DJMAX RESPECT
- 动画
- animate
---

<hr>
:disappointed:目前*(2019/02/18)*官网早已进行了更新，网站中不再有本文所重点介绍的背景特效了。目前网站主页的逻辑主要是写在[home.js](http://www.arcsystemworks.jp/djmax_respect/js/home.js?ver=20)中，引用的库并没有变。我把原来的`teaser.js`备份在[这里](/assets/js/teaser.js)了，下次会记得保存效果图的。
<hr>

前不久*(2017/07/28)*，DJMAX RESPECT发售。查找资料时发现它在日本的[宣传网站](http://www.arcsystemworks.jp/djmax_respect/){:target="_blank"}看起来简单而酷炫，因此决定研究一下其效果是如何实现的。

## 动效实现

### 实现

查看引用的js，可以看到网站使用了[jQuery Scrollify](https://projects.lukehaas.me/scrollify/){:target="_blank"}这个滑动动画的库，[CreateJS](http://www.createjs.com/){:target="_blank"}，[Velocity.js](http://velocityjs.org/){:target="_blank"}这两个动画库，以及[Ease+ for Velocity.js](https://github.com/yuichiroharai/easeplus-velocity)，[jQuery easing](http://gsgd.co.uk/sandbox/jquery/easing/){:target="_blank"}这两个缓动(easing)库。[^1]

其中，`Velocity.js`采用了和`jQuery`中[animate()](http://api.jquery.com/animate/){:target="_blank"}相同的API，在性能优化的同时还加入了循环、滚动、变换等效果。

`Ease+ for Velocity.js`借鉴`TweenJS(CreateJS)`，实现了`Velocity.js`未实现的*Back*, *Elastic*, *Bounce*这三个缓动效果。

页面的逻辑都写在[teaser.js](http://www.arcsystemworks.jp/djmax_respect/js/teaser.js){:target="_blank"}里。

通过代码可以看出：
1. 加载的进度条是根据`PreloadJS(CreateJS)`实现的
2. 中间旋转的logo是使用了gif图片
3. 背景使用`CreateJS`做了两个定时动画
4. 中间的三行文字用的是背景图，文字的滑动通过`Velocity.js`实现
5. 滚动的效果是利用`jQuery Scrollify`实现的
6. 其他小动效都是使用`Velocity.js`实现的

### 分析

值得仔细说的是背景的动效，好在注释写的很清楚（虽然有点问题），看起来轻松不少。

网站的背景色为`#fcf0b0`，同时维护了两个canvas作为容器（Stage），执行了相同的白色斜线（particle）滑动的效果。两个canvas的`z-index`分别为1，3，透明度为0.5，而中间文字的`z-index`为2，借此实现立体的效果。旋转logo的`z-index`为4。

粒子滑动实现的主要思想是借助`CreateJS`提供的[Ticker](http://www.createjs.com/docs/easeljs/classes/Ticker.html){:target="_blank"}定时，在每个周期中生成斜线、设定斜线的动画，删除斜线。

1. 定时使用的是[requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame){:target="_blank"}的频率。
> 
```javascript
    createjs.Ticker.addEventListener("tick", particle_tick);
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
```

2. 前10个周期，每个周期生成1个斜线。之后每5个周期生成一个斜线。<span></span>
>
```javascript
    //20回ごとに1回発生。ただし最初の10回は1回ごとに発生。
    if(emit_cnt > 15) emit_cnt = 10;
    if(emit_cnt <= 10){
        particle_emit_lo();
        particle_emit_up();
    }
    emit_cnt++;
```

3. 斜线的宽度随机生成，高度为x偏移量未屏幕的宽度。注意这里的坐标是以`(particle.x, particle.y)`为`(0, 0)`的。[^2]
>
```javascript
    //オブジェクトの作成
	var particle = new createjs.Shape();
    ...
    //発生する場所をランダムで決定
	particle.x = ( lo_stage.canvas.width * 2 ) * ( Math.random() );
	particle.y = window_h;
	//画面に表示され続ける時間
	particle.delay = 60 * ( 1 - Math.random());
    //サイズをランダムで決定
    particle.size = base_size * (1.3-Math.random());
    //形を指定
    particle.graphics.f(particle.color)
        .lt(particle.size,0)
        .lt(window_h+particle.size,0-window_h)
        .lt(window_h,0-window_h)
        .lt(0,0);
```

4. 斜线的动画有两段，前70个周期向左下移动，经过`particle.delay`个周期不动后，后70个周期向右下移动。
>
```javascript
    //進行度カウントが100まで = 全体を表示するのにかける時間
	if(particle.life < 70){
		var now_progress = jQuery.easing.easeOutExpo(null, particle.life, 0, 1, 69);
		particle.x = particle.start_x - (window_h * now_progress);
		particle.y = window_h * now_progress;
    }
	if(particle.life >= particle.delay + 70){
		var lastlife = particle.life - particle.delay - 70;
		var now_progress = jQuery.easing.easeOutExpo(null, lastlife, 0, 1, 69);
		particle.x = ( particle.start_x - window_h ) - (window_h * now_progress);
		particle.y = window_h + ( window_h * now_progress);
	}
    // 表示時間+表示までにかかる時間+消えるまでにかかる時間の合計を越えたら寿命
    if (particle.life >= particle.delay + 140) {
		...
	}
```

## 总结

### 环境判断

该网站使用了[Modernizr](https://modernizr.com/){:target="_blank"}，根据是否支持`touchevents`，来区别执行一些相关的函数。

需要注意的是，根据Modernizr的文档，支持`touchevents`的设备并不一定是移动设备，反之亦然。[^3]

### 其他

1. 这种需要加载很多资源才能显示效果的网站还是提供进度条，等待资源全部加载完时再显示比较友好
2. 对于不支持某些动画效果的浏览器，需要做降级处理

## 参考链接

[^1]: 若对缓动有疑问，请参考[这个网站](http://easings.net/){:target="_blank"}
[^2]: 可参考[Shape](http://www.createjs.com/docs/easeljs/classes/Shape.html){:target="_blank"}和[Graphics](http://www.createjs.com/docs/easeljs/classes/Graphics.html){:target="_blank"}的文档
[^3]: [You Can't Detect A Touchscreen](http://www.stucox.com/blog/you-cant-detect-a-touchscreen/){:target="_blank"}