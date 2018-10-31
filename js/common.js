(function($, owner) {
	loadProperties();
}(mui, document));
//加载国际化文件
function loadProperties(){
    jQuery.i18n.properties({//加载properties文件  
        name:'app-config',//properties文件的名称  
        path:'i18n/',//properties文件的路径  
        mode:'map',//用map的方式使用资源文件中的值  
        language : 'zh',
        cache: false,
        callback:function(){  
//          console.log($.i18n.prop("backer_url"));//根据key值取得需要的资源  
        }
    }); 
}

// 上传文件  
function uploadByIds(fileIds) { 
	for(var i=0;i<fileIds.length;i++){
		var file = document.getElementById(fileIds[i]).files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file); 
		reader.onload=function(e){
			var base64 = reader.result.split(',')[1];
			uploadBase64(base64,file.name);
    	} 
	}
}

function uploadBase64(fileBase64,fileName){
	mui.ajax($.i18n.prop('backer_url')+'app/sysFile/uploadBase64',{
		data:{
			fileBase64:fileBase64,
			fileName:fileName
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		headers:{'Content-Type':'application/x-www-form-urlencoded'},
		async : false,
		success:function(data){
			console.log(data);
		},
		error:function(xhr,type,errorThrown){
			//异常处理；
			mui.toast('网络异常');
			console.log("反馈失败");
		}
	});
}
