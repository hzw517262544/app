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
