		mui.init({
			swipeBack:true //启用右滑关闭功能
		});
		 //初始化单页view
		var viewApi = mui('#app').view({
			defaultPage: '#setting'
		});
		 //初始化单页的区域滚动
		mui('.mui-scroll-wrapper').scroll();
		 //分享操作 
		var shares = {};
		mui.plusReady(function() {
			plus.share.getServices(function(s) {
				if (s && s.length > 0) {
					for (var i = 0; i < s.length; i++) {
						var t = s[i];
						shares[t.id] = t;
					}
				}
			}, function() {
				console.log("获取分享服务列表失败");
			});
		});
		 //分享链接点击事件
		document.getElementById("share").addEventListener('tap', function() {
			var ids = [{
					id: "weixin",
					ex: "WXSceneSession"
				}, {
					id: "weixin",
					ex: "WXSceneTimeline"
				}, {
					id: "sinaweibo"
				}, {
					id: "tencentweibo"
				}, {
					id: "qq"
				}],
				bts = [{
					title: "发送给微信好友"
				}, {
					title: "分享到微信朋友圈"
				}, {
					title: "分享到新浪微博"
				}, {
					title: "分享到腾讯微博"
				}, {
					title: "分享到QQ"
				}];
			plus.nativeUI.actionSheet({
				cancel: "取消",
				buttons: bts
			}, function(e) {
				var i = e.index;
				if (i > 0) {
					var s_id = ids[i - 1].id;
					var share = shares[s_id];
					if (share.authenticated) {
						shareMessage(share, ids[i - 1].ex);
					} else {
						share.authorize(function() {
							shareMessage(share, ids[i - 1].ex);
						}, function(e) {
							console.log("认证授权失败：" + e.code + " - " + e.message);
						});
					}
				}
			});
		});

		function shareMessage(share, ex) {
				var msg = {
					extra: {
						scene: ex
					}
				};
				msg.href = "http://www.dcloud.io/hellomui/";
				msg.title = "最接近原生APP体验的高性能前端框架";
				msg.content = "我正在体验HelloMUI，果然很流畅，基本看不出和原生App的差距";
				if (~share.id.indexOf('weibo')) {
					msg.content += "；体验地址：http://www.dcloud.io/hellomui/";
				}
				msg.thumbs = ["_www/images/logo.png"];
				share.send(msg, function() {
					console.log("分享到\"" + share.description + "\"成功！ ");
				}, function(e) {
					console.log("分享到\"" + share.description + "\"失败: " + e.code + " - " + e.message);
				});
			}
			//去评分
		document.getElementById("rate").addEventListener('tap', function() {
			if (mui.os.ios) {
				location.href = 'https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=682211190&pageNumber=0&sortOrdering=2&type=&mt=8';
			} else if (mui.os.android) {
				plus.runtime.openURL("market://details?id=io.dcloud.HelloMUI", function(e) {
					plus.runtime.openURL("market://details?id=io.dcloud.HelloMUI", function(e) {
						mui.alert("360手机助手和应用宝，你一个都没装，暂时无法评分，感谢支持");
					}, "com.qihoo.appstore");
				}, "com.tencent.android.qqdownloader");
			}
		});
		 //客服电话
		document.getElementById("tel").addEventListener('tap', function() {
			plus.device.dial("114");
		});
		 //退出操作******************
		document.getElementById('exit').addEventListener('tap', function() {
			if (mui.os.ios) {
				app.setState({});
				mui.openWindow({
					url: 'login.html',
					id: 'login',
					show: {
						aniShow: 'pop-in'
					},
					waiting: {
						autoShow: false
					}
				});
				return;
			}
			var btnArray = [{
				title: "切换账号"
			}, {
				title: "退出应用"
			}];
			plus.nativeUI.actionSheet({
				cancel: "取消",
				buttons: btnArray
			}, function(event) {
				var index = event.index;
				switch (index) {
					case 1:
						//注销账号
						app.setState({});
						/*
						 * 注意：
						 * 1、因本示例应用启动页就是登录页面，因此注册成功后，直接显示登录页即可；
						 * 2、如果真实案例中，启动页不是登录页，则需修改，使用mui.openWindow打开真实的登录页面
						 */
						plus.webview.getLaunchWebview().show("pop-in");
						//若启动页不是登录页，则需通过如下方式打开登录页
//						mui.openWindow({
//							url: 'login.html',
//							id: 'login',
//							show: {
//								aniShow: 'pop-in'
//							}
//						});
						break;
					case 2:
						plus.runtime.quit();
						break;
				}
			});
		}, false);
		 //************************
		 //锁屏设置
		(function($, doc) {
			//$.init();
			$.plusReady(function() {
				var settings = app.getSettings();
				var lockStateButton = doc.getElementById("lockState");
				var locker = doc.querySelector('.mui-locker');
				lockStateButton.classList[settings.gestures ? 'add' : 'remove']('mui-active')
				locker.style.display = settings.gestures ? 'block' : 'none';
				lockStateButton.addEventListener('toggle', function(event) {
					var isActive = event.detail.isActive;
					locker.style.display = isActive ? 'block' : 'none';
					if (!isActive) {
						//						alert(0);
						settings.gestures = '';
						app.setSettings(settings);
					}
				}, false);
				var record = [];
				locker.addEventListener('done', function(event) {
					var rs = event.detail;
					if (rs.points.length < 4) {
						plus.nativeUI.toast('设定的手势太简单了');
						record = [];
						rs.sender.clear();
						return;
					}
					record.push(rs.points.join(''));
					if (record.length >= 2) {
						if (record[0] == record[1]) {
							plus.nativeUI.toast('解锁手势设定成功，以后用户只需使用手势解锁而无需输入密码登录。');
							settings.gestures = record[0];
							settings.autoLogin = true;
							app.setSettings(settings);
							setTimeout(function() {
								$.back();
							}, 200);
						} else {
							plus.nativeUI.toast('两次手势不一致,请重新设定');
						}
						rs.sender.clear();
						record = [];
					} else {
						plus.nativeUI.toast('请确认手势设定');
						rs.sender.clear();
					}
				}, false);
			});
		}(mui, document));
		 //********************
		var view = viewApi.view;
		(function($) {
			//处理view的后退与webview后退
			var oldBack = $.back;
			$.back = function() {
				if (viewApi.canBack()) { //如果view可以后退，则执行view的后退
					viewApi.back();
				} else { //执行webview后退
					oldBack();
				}
			};
			//监听页面切换事件方案1,通过view元素监听所有页面切换事件，目前提供pageBeforeShow|pageShow|pageBeforeBack|pageBack四种事件(before事件为动画开始前触发)
			//第一个参数为事件名称，第二个参数为事件回调，其中e.detail.page为当前页面的html对象
			view.addEventListener('pageBeforeShow', function(e) {
				//				console.log(e.detail.page.id + ' beforeShow');
			});
			view.addEventListener('pageShow', function(e) {
				//进入手执设定界面时
				if (e.detail.page.id == 'lock') {
					var settings = app.getSettings();
					/*if (!settings.autoLogin) {
						plus.nativeUI.toast('当前没有启用 “自动登录”，需要在登录时启用 "自动登录"，设定的手势锁屏才会升效。');
					}*/
					var lockStateButton = document.getElementById("lockState");
					var locker = document.querySelector('.mui-locker');
					lockStateButton.classList[settings.gestures ? 'add' : 'remove']('mui-active')
					locker.style.display = settings.gestures ? 'block' : 'none';
				}
				//				console.log(e.detail.page.id + ' show');
			});
			view.addEventListener('pageBeforeBack', function(e) {
				//				console.log(e.detail.page.id + ' beforeBack');
			});
			view.addEventListener('pageBack', function(e) {
				//				console.log(e.detail.page.id + ' back');
			});
		})(mui);