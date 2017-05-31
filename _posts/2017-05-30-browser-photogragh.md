---
layout: post
title:  浏览器中拍照、上传
date:   2017-05-30
tags:
- camera
- getUserMedia
---

前不久碰到了这样的需求：在网页中调用摄像头，拍照后上传图片。

实现并不难，可直接参考[webRTC](https://webrtc.org/){:target="_blank"}给出的[demo](https://webrtc.github.io/samples/src/content/getusermedia/canvas/){:target="_blank"}。但一来网上搜出来的文章都比较早，很多API已不再适用；二来涉及的东西较多，还是值得总结一下。

## 方法概述

- 通过[navigator.mediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia){:target="_blank"}方法获取摄像头媒体流，用[video标签](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video){:target="_blank"}展示
- 拍照时借助[canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API){:target="_blank"}中的[drawImage()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage){:target="_blank"}方法截取图片
- 如需保存或上传，可使用[toDataURL()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL){:target="_blank"}方法获取图像

## 获取媒体流

`MediaDevices.getUserMedia()`方法可获取媒体流，该方法返回的是一个[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise){:target="_blank"}。

### 1. 基本用法

```javascript
navigator.mediaDevices.getUserMedia(constraints)
.then(function(stream) {
  /* use the stream */
}).catch(function(err) {
  /* handle the error */
});
```

其中参数`constraints`是一个[MediaStreamConstraints](https://www.w3.org/TR/mediacapture-streams/#mediastreamconstraints){:target="_blank"}对象，其属性audio，video的值可配置为`boolean`或`MediaTrackConstraints`对象，默认为`false`。

具体配置可参考[MediaTrackConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints){:target="_blank"}或直接看[标准](https://www.w3.org/TR/mediacapture-streams/#media-track-constraints){:target="_blank"}。可使用`navigator.mediaDevices.getSupportedConstraints()`方法检测浏览器对这些限制的支持情况。

### 2. 权限

调用`getUserMedia`方法时会根据`constraints`中的配置提示用户授权以使用摄像头、麦克风。

### 3. 兼容性

之前的API是[navigator.getUserMedia(constraints, successCallback, errorCallback)](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia){:target="_blank"}。Chrome和FireFox在早期分别实现了带前缀的方法`navigator.webkitGetUserMedia`和`navigator.mozGetUserMedia`。

对于旧版本的浏览器，可使用[adapter.js](https://github.com/webrtc/adapter){:target="_blank"}来polyfill。

在Chrome中，调用`getUserMedia`要求必须使用安全的协议（如`https`），否则会报错。详情请点[这里](https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features){:target="_blank"}。

### 4. 视频显示

需要注意的是，在旧版本的浏览器中`<video>`并不支持[srcObject](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject){:target="_blank"}。[^1]

```javascript
var video = document.querySelector('video');
// Older browsers may not have srcObject
if ("srcObject" in video) {
    video.srcObject = stream;
} else {
    // Avoid using this in new browsers, as it is going away.
    video.src = window.URL.createObjectURL(stream);
}
```

## 拍照

截取视频的当前帧，显示在canvas上。

```javascript
var video = document.querySelector('video');
var button = document.querySelector('button');
button.onclick = function() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').
        drawImage(video, 0, 0, canvas.width, canvas.height);
};
```

## 图片上传

`canvas.toDataURL`方法返回的是一个[data URI](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs){:target="_blank"}。
那么最简单的上传方法是将这个字符串直接传给后台，后台选择直接使用还是做相应处理。

若后台并未提供data URI字符串的接口，那么就需要将base64编码的字符串转化成二进制数据，来上传图片。

可以选择构造[File](https://developer.mozilla.org/en-US/docs/Web/API/File){:target="_blank"}或[Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob){:target="_blank"}对象，通过[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData){:target="_blank"}上传。而对于第三方SDK上传，通常也会提供`File`或`Blob`为参数的接口。

由于`File`或`Blob`都可由[ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer){:target="_blank"}构造，因此只需将data URI字符串转化为`ArrayBuffer`。`ArrayBuffer`有不同的数据格式视图，统称为[TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays){:target="_blank"}，下面的方法选择的是[Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array){:target="_blank"}（无符号8位整数数组）。[^2]

```javascript
function dataURItoArrayBuffer(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var bufferArray = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        bufferArray[i] = byteString.charCodeAt(i);
    }
    return bufferArray;
}
```

事实上，Node.js中的`Buffer`类即实现了`Uint8Array`的API，可以通过[Buffer.from()](https://nodejs.org/api/buffer.html#buffer_class_method_buffer_from_string_encoding){:target="_blank"}方法来构造。浏览器中也可通过引用[buffer](https://github.com/feross/buffer){:target="_blank"}实现对`Buffer`类的支持。


## 参考链接

[^1]: [caniuse.com中getUserMedia的注解](http://caniuse.com/#feat=stream){:target="_blank"}
[^2]: 关于JavaScript操作二进制数据的接口，建议阅读[这篇文章](http://javascript.ruanyifeng.com/stdlib/arraybuffer.html){:target="_blank"}