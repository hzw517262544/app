(function(mui, window, document, undefined) {
	mui.init();
	var get = function(id) {
		return document.getElementById(id);
	};
	var qsa = function(sel) {
		return [].slice.call(document.querySelectorAll(sel));
	};
	var ui = {
		question: get('question'),
		contact: get('contact'),
		imageList: get('image-list'),
		submit: get('submit'),
		cancle:get('cancle')
	};
	ui.clearForm = function() {
		ui.question.value = '';
		ui.contact.value = '';
		ui.imageList.innerHTML = '';
		ui.newPlaceholder();
	};
	ui.getFileInputArray = function() {
		return [].slice.call(ui.imageList.querySelectorAll('input[type="file"]'));
	};
	ui.getFileInputIdArray = function() {
		var fileInputArray = ui.getFileInputArray();
		var idArray = [];
		fileInputArray.forEach(function(fileInput) {
			if (fileInput.value != '') {
				idArray.push(fileInput.getAttribute('id'));
			}
		});
		return idArray;
	};
	var imageIndexIdNum = 0;
	ui.newPlaceholder = function() {
		var fileInputArray = ui.getFileInputArray();
		if (fileInputArray &&
			fileInputArray.length > 0 &&
			fileInputArray[fileInputArray.length - 1].parentNode.classList.contains('space')) {
			return;
		}
		imageIndexIdNum++;
		var placeholder = document.createElement('div');
		placeholder.setAttribute('class', 'image-item space');
		var closeButton = document.createElement('div');
		closeButton.setAttribute('class', 'image-close');
		closeButton.innerHTML = 'X';
		closeButton.addEventListener('click', function(event) {
			event.stopPropagation();
			event.cancelBubble = true;
			setTimeout(function() {
				ui.imageList.removeChild(placeholder);
			}, 0);
			return false;
		}, false);
		var fileInput = document.createElement('input');
		fileInput.setAttribute('type', 'file');
		fileInput.setAttribute('accept', 'image/*');
		fileInput.setAttribute('id', 'image-' + imageIndexIdNum);
		fileInput.addEventListener('change', function(event) {
			var file = fileInput.files[0];
			if (file) {
				
				var reader = new FileReader();
				reader.onload = function() {
					//处理 android 4.1 兼容问题
					var base64 = reader.result.split(',')[1];
					var dataUrl = 'data:image/png;base64,' + base64;
					//
					placeholder.style.backgroundImage = 'url(' + dataUrl + ')';
					
				}
				reader.readAsDataURL(file);
				placeholder.classList.remove('space');
				ui.newPlaceholder();
				
			}
		}, false);
		placeholder.appendChild(closeButton);
		placeholder.appendChild(fileInput);
		ui.imageList.appendChild(placeholder);
	};
	ui.newPlaceholder();
	ui.submit.addEventListener('tap', function(event) {
		if(ui.question.value == ''){
			mui.toast("请填写问题和意见");
			return false;
		}
		/*if (ui.contact.value != '' &&
				ui.contact.value.search(/^(\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+)|([1-9]\d{4,9})$/) != 0) {
			return mui.toast('请填写正确的邮箱');
		}*/
		submitQuestion(ui);
		/*feedback.send({
			question: ui.question.value,
			contact: ui.contact.value,
			images: ui.getFileInputIdArray()
		}, function() {
			plus.nativeUI.closeWaiting();
			mui.toast('感谢您的建议~');
			ui.clearForm();
			mui.back();
		});*/
	}, false);
	
	ui.cancle.addEventListener('tap',function(event){
		ui.clearForm();
		mui.back();
	}, false);
})(mui, window, document, undefined);

function submitQuestion(ui){
	var fileIds = ui.getFileInputIdArray();
	
	plus.nativeUI.showWaiting();
	mui.ajax($.i18n.prop('backer_url')+'/app/questionsSuggestions/save',{
		data:{
			content:ui.question.value,
			contact:ui.contact.value,
			images:ui.getFileInputIdArray(),
			createUser:app.getState().account
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		headers:{'Content-Type':'application/x-www-form-urlencoded'},
		async : true,
		success:function(data){
			uploadByIds(fileIds,data.id);
			//服务器返回响应，根据响应结果，分析是否登录成功；
			plus.nativeUI.closeWaiting();
			mui.toast('感谢您的建议~');
			ui.clearForm();
			mui.back();
			
		},
		error:function(xhr,type,errorThrown){
			//异常处理；
			mui.toast('网络异常');
			console.log("反馈失败");
		}
	});
}
