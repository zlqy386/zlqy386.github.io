---
layout: post
title:  使用 DigitalOcean 和 Shadowsocks 科学上网
date:   2019-02-24
lastUpdate: 2019-02-25
published: false
tags:
- DigitalOcean
- Shadowsocks
- VPS
---

目前上网的难度越来越高，到现在为止我用过比较稳定的方式也就是自建VPS（Virtual Private Server 虚拟专用服务器）和[ExpressVPN](https://www.expressvpn.com/)。相比之下，ExpressVPN能提供更多地区的节点，也能提供更多的接入方式，甚至是在主机上配置，但价格偏贵（每月$8.32）[^1]；而VPS价格相对便宜。可以选择购买已有的VPS，但若要稳定，或是有其他原因需要使用服务器，那么就可以选择自建VPS。

之前按照[使用 DigitalOcean 和 shadowsocks 来科学上网](http://jerryzou.com/posts/shadowsocks-and-digitalocean/)这篇教程来搭建VPS的。最近重新配置了下，发现还是有些新的变化，所以重新总结了下配置的步骤，同时解释下一些选择的原因。

## 服务器

### 服务器选择

市面上有很多VPS提供商，比如[Vultr](https://www.vultr.com/)、[Linode](https://www.linode.com/)和[DigitalOcean](https://www.digitalocean.com/)。这三个服务商在最低价格（每月$5）的配置是一样的：单核、1G内存、25T的SSD以及1T的流量。

除了速度，这里列几个主要的区别：

- Vultr支持国内的支付方式：支付宝、微信和银联
- Linode必须要绑定信用卡才可使用
- DigitalOcean没有日本的机器

选择DigitalOcean主要是因为申请了[GitHub Student Developer Pack](https://education.github.com/pack)后可以赠送$50，对于学生来说很划算[^2]。

### DigitalOcean

可以使用我的[邀请链接](https://m.do.co/c/c23e3d3f6a89)或直接进入[官网](https://www.digitalocean.com/)注册账号，成功后需要绑定支付方式才可以创建服务器。

选择创建Droplets，最低档（每月$5）的标准Droplet就可以满足需求了。选择服务器所在区域后，记得一定要配置SSH key才可以免密码登陆新建的服务器。创建后，就能在dashboard上查看对应的服务器信息和状态了。

## Shadowsocks

[Shadowsocks](https://shadowsocks.org/en/index.html)是一种基于[Socks5](https://en.wikipedia.org/wiki/SOCKS)代理方式的加密传输协议，可以用于代理。网上教程很多，这里只是介绍下我的配置。

### 服务端

原有的`Python`版本[代码](https://github.com/shadowsocks/shadowsocks)在Github上已被删除，因此这次尝试了`Go`[版本](https://github.com/shadowsocks/shadowsocks-go)。以下以我选择的服务器版本`Ubuntu 18.10 x64`为例。

#### 安装Go

按照DigitalOcean上的[教程](https://www.digitalocean.com/community/tutorials/how-to-install-go-on-ubuntu-18-04)安装`Go`。

1 首先下载安装包，当前（2019/02/24）版本是11.5：

```bash
cd ~
curl -O https://dl.google.com/go/go1.11.5.linux-amd64.tar.gz
```

2 验证checksum是否为`ff54aafedff961eb94792487e827515da683d61a5f9482f668008832631e5d25`

```bash
sha256sum go1.11.5.linux-amd64.tar.gz
```

3 解压缩并复制到推荐的安装目录`/usr/local`

```bash
tar xvf go1.11.5.linux-amd64.tar.gz
sudo chown -R root:root ./go
sudo mv go /usr/local
```

4 配置环境变量

```bash
sudo vim ~/.profile
```

在最后添加：

``` profile
export GOPATH=$HOME/work
export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin
```

5 检查是否已成功安装

```bash
go version
```

#### 安装Shadowsocks

```bash
go get github.com/shadowsocks/shadowsocks-go/cmd/shadowsocks-server
```

#### 启动Shadowsocks

尽管可以使用命令行参数启动Shadowsocks服务，但还是建议使用配置文件的方式，便于修改。

```bash
mkdir /etc/shadowsocks
vim /etc/shadowsocks/config.json
```

单用户使用以下配置即可，请填入自己的服务器地址、设置的端口和密码：

```json
{
  "server":"你的服务器ip地址",
  "server_port":8388,
  "local_address": "127.0.0.1",
  "local_port":1080,
  "password":"你设置的密码",
  "timeout":300,
  "method":"aes-256-cfb",
  "fast_open": false
}
```

随后在后台启动服务：[^3]

```bash
shadowsocks-server -c /etc/shadowsocks/config.json > log &
```

### 客户端

几乎所有平台都有对应的客户端，可以在[官网](https://shadowsocks.org/en/download/clients.html)下载。配置对应的服务器、端口和密码即可。

### 优化

网上的教程[^4][^5]中都有很多优化方法，提高链接的速度。我只采用了BBR。

### BBR

BBR（**B**ottleneck **B**andwidth and **R**ound-trip propagation time）是Google于2016年新提出的TCP拥塞控制（congestion control）算法。在Linux kernel 4.9中引入。

#### 检查BBR是否开启

首先检查Linux内核版本，若版本小于4.9则需要更新内核或更细系统。

``` bash
uname -r
```

随后检查是否开启BBR：

``` bash
lsmod | grep bbr
```

若结果中没有出现`tcp_bbr`，则需要配置开启BBR。

#### 开启BBR

在`/etc/sysctl.conf`文件最后增加

```conf
net.core.default_qdisc=fq
net.ipv4.tcp_congestion_control=bbr
```

重启加载配置

``` bash
sysctl -p
```

使用以下三个命令检查是否配置成功

``` bash
lsmod | grep bbr
sysctl net.ipv4.tcp_available_congestion_control
sysctl net.ipv4.tcp_congestion_control
```

## 参考资料

[^1]: 如果想要体验，可以用这个[链接](https://www.expressrefer.com/refer-friend?referrer_id=13691742&utm_campaign=referrals&utm_medium=copy_link&utm_source=referral_dashboard)注册账号，免费使用90天
[^2]: 如果想使用Vultr或者Linode，也可以使用我的邀请码注册，分别是[Vultr](https://www.vultr.com/?ref=7899641-4F)和[Linode](https://www.linode.com/?r=78b5a5e9a4fb7ad71ac099ff14c15738ad6102fb)。Linode还可以使用[教程](https://www.linode.com/docs/platform/billing-and-support/billing-and-payments/)中的促销码获得$10，目前（2019/02/24）促销码是DOCS10
[^3]: 更多命令行文档，请参考[shadowsocks-go](https://github.com/shadowsocks/shadowsocks-go#usage)
[^4]: [Ubuntu 下 Shadowsocks 服务端的安装及优化](http://blog.drsanwujiang.com/2018/12/ubuntu%E4%B8%8Bshadowsocks%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E5%AE%89%E8%A3%85%E5%8F%8A%E4%BC%98%E5%8C%96/)
[^5]: [科学上网之 Shadowsocks 安装及优化加速](http://wuchong.me/blog/2015/02/02/shadowsocks-install-and-optimize/)