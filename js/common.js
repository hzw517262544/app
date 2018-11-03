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
function uploadByIds(fileIds,sourceId) { 
	for(var i=0;i<fileIds.length;i++){
		var file = document.getElementById(fileIds[i]).files[0];
		uploadFile(file,sourceId);
	}
}

function uploadFile(file,sourceId){
	/*var size = file.size;
    if((size / 1024 / 1024) > 2) {
        alert("图片大小不能超过2M...");
        return false;
    }*/
    var formData = new FormData();
    formData.append("file", file);
    formData.append("sourceId", sourceId);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", $.i18n.prop('backer_url')+'app/sysFile/upload');
    xhr.send(formData);
	/*mui.ajax($.i18n.prop('backer_url')+'app/sysFile/upload',{
		data:formData,
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
	});*/
}



//返回值:拼音首字母串数组  
function makePy(str)  
{    
        if(typeof(str) != "string")    
        throw new Error(-1,"函数makePy需要字符串类型参数!");    
        var arrResult = new Array();   
        //将字符串转码后转为数组  
        for(var i=0,len=str.length;i<len;i++)  
        {    
            var ch = str.charAt(i);    
            arrResult.push(checkCh(ch));    
        }    
        return mkRslt(arrResult);    
}    
//测试程序  
function get()  
{  
    var str = document.getElementById("text").value;  
    alert(makePy(str));  
}  
  
  
function checkCh(ch)  
{    
    var uni = ch.charCodeAt(0);    
    //如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数    
    if(uni > 40869 || uni < 19968)    
    return ch; //dealWithOthers(ch);    
    //检查是否是多音字,是按多音字处理,不是就直接在strChineseFirstPY字符串中找对应的首字母    
    return (oMultiDiff[uni]?oMultiDiff[uni]:(strChineseFirstPY.charAt(uni-19968)));    
}    
function mkRslt(arr)  
{    
    var arrRslt = [""];    
    for(var i=0,len=arr.length;i<len;i++)  
    {    
        var str = arr[i];    
        var strlen = str.length;    
        if(strlen == 1)  
        {    
            for(var k=0;k<arrRslt.length;k++)  
            {    
                arrRslt[k] += str;    
            }    
        }  
        else  
        {    
            var tmpArr = arrRslt.slice(0);    
            arrRslt = [];    
            for(k=0;k<strlen;k++)  
            {    
                //复制一个相同的arrRslt    
                var tmp = tmpArr.slice(0);    
                //把当前字符str[k]添加到每个元素末尾    
                for(var j=0;j<tmp.length;j++)  
                {    
                    tmp[j] += str.charAt(k);    
                }    
                //把复制并修改后的数组连接到arrRslt上    
                arrRslt = arrRslt.concat(tmp);    
            }    
        }    
    }    
    return arrRslt;    
}

