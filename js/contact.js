mui.init(
	loadContact()
);

function loadContact(){
	var stateText = JSON.parse(localStorage.getItem('$state'))
	var localUserId = stateText.account ;
//	console.log(localUserId);
	mui.ajax($.i18n.prop('backer_url')+'/app/contact/list',{
		data:{
			userId:localUserId,
			limit:100,
			offset:0
		},
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		headers:{'Content-Type':'application/x-www-form-urlencoded'},
		async : false,
		success:function(data){
			
			var contactTable = document.querySelector(".mui-table-view");
			var rows = data.rows;
				if(rows.length>0){
				for(var i=0;i<rows.length;i++){
					var row = rows[i];
					var li = document.createElement('li');
					li.className = 'mui-table-view-cell';
					li.innerHTML = "<div class='mui-slider-cell'>"+
											"<div class='oa-contact-cell mui-table'>"+
												"<div class='oa-contact-avatar mui-table-cell'>"+
												"<img src='images/60x60.gif' />"+
												"</div>"+
												"<div class='oa-contact-content mui-table-cell'>"+
												"<div class='mui-clearfix'>"+
												"<h4 class='oa-contact-name'>"+row.contactUserName+"</h4>"+
												"<span class='oa-contact-position mui-h6'>"+row.remark+"</span>"+
												"</div>"+
												"<p class='oa-contact-email mui-h6'>"+
												"yewenjie@sina.com"+
												"</p>"+
												"</div>"+
											"</div>"+
										"</div>"
					contactTable.appendChild(li);
					}
				}
		},
		error:function(xhr,type,errorThrown){
			//异常处理；
			console.log(type+$.i18n.prop('backer_url'));
		}
	});
}
