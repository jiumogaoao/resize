	var isAndroid=true;
	var browser = {
  versions: function () {
  var u = navigator.userAgent, app = navigator.appVersion;
  return {//移动终端浏览器版本信息
   trident: u.indexOf('Trident') > -1, //IE内核
   presto: u.indexOf('Presto') > -1, //opera内核
   webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
   gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
   mobile: !!u.match(/AppleWebKit.*Mobile/i) || !!u.match(/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/), //是否为移动终端
   ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
   android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
   iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
   iPad: u.indexOf('iPad') > -1, //是否iPad
   webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
  };
  } (),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
if (browser.versions.iPhone || browser.versions.iPad || browser.versions.ios) {
isAndroid=false;
}
if (browser.versions.android) {
isAndroid=true;
}
	
	var readFn={
        anRun:function(){
            var anRunDelay=setTimeout(function(){
              $("body").addClass("anActive");  
            },50);
        
        }
    }
	/*滚屏*/
    var scrollArray=[];
    $(document).ready(function(){
        $.each(readFn,function(index,fn){
            fn();
        });
    });
    /*干掉默认事件*/
	if(!isIe8){
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		}
    
    /*自适应处理*/
	function size(){
		var w=$(window).width();
		if(navigator.userAgent.indexOf("WindowsWechat")>-1){
        w=360;
    }
		if(isIe8){w=$("html").width()}
        return w/750;
		}
	function getH(){
		if(navigator.userAgent.indexOf("WindowsWechat")>-1&&$(window).width()>360){
			var left=($(window).width()>360)?($(window).width()-360)/2:0;
			$("html").css({
				"float":"none",
				"box-shadow":"0px 0px 10px 5px rgba(0,0,0,0.3)",
				"position": "relative",
				"left":left+"px"
				});
            return 1452;
        }else{
            return $(window).height()*(750/$(window).width());
        }
		}
    function resize(){
		if(!isAndroid){
			$("html").removeAttr("style");
			}
		var rsDelay=setTimeout(function(){
			if(isIe8){
				$("body").css({
					"zoom":size(),
					"height":getH()
					});
				}else{
				$("html").css({
              "-webkit-transform":"scale("+size()+")",
			  "transform":"scale("+size()+")",
              "height":getH()
});	
					}
			
tool.refresh();
			},(isAndroid?0:500));
		
		}
    /*先执行一次*/
    readFn.rs=function(){
        var rsDelay=setTimeout(function(){
			if(isIe8){
				$("body").css({
					"zoom":size()
					});
				}else{
			$("html").css({
              "-webkit-transform":"scale("+size()+")",
			  "transform":"scale("+size()+")",
              "height":getH()
});
				}
		},50);
		};
    /*屏幕有变动的时候再执行*/
    $(window).on("resize",resize);
    
    /************通用方法*************/
    (function(){
		var acDelay=setTimeout(function(){
			/*滚屏*/
    $(".wrap").each(function(){
        var newScroll=new IScroll('#'+$(this).attr("id"), { probeType: 3 });
        scrollArray.push(newScroll);
        $("img").on("load",function(){
    	tool.refresh();
});
    });
			},200);
    })();
    /************工具方法*************/
    var tool = {};
	/*重计算滚动*/
	tool.refresh = function(){
		var rsDelay=setTimeout(function(){
			$.each(scrollArray,function(index,sc){
        sc.refresh();
    })
			},200);
		
		}
    /*弹出*/
    /*text:弹出内容*/
    /*fn:关闭回调*/
    tool.pop = function(text,fn,buttonName){
        if(!buttonName){
            buttonName="确定";
        }
        $("#pop #popMain").html(text);
        $("#pop #popButton").html(buttonName);
        $("#pop").show();
        $("#popBg").show();
        $("#pop #popButton").unbind("click").bind("click",function(e){
            $("#pop").hide();
            $("#popBg").hide();
            if(fn){
                fn();
            }
        });
        $("#popBg").unbind("tap").bind("tap",function(){
            $("#pop").hide();
            $("#popBg").hide();
        });
    };
    /*验证手机格式*/
    /*text:手机号*/
    tool.phoneCheck = function(text){
        return /^1[3|4|5|7|8]\d{9}$/.test(text);
    }
    /*验证姓名格式*/
    /*text:姓名*/
    tool.nameCheck = function(text){
        if(text.length>=2&&text.length<=8){
            return true;
        }else{
            return false;
        }
    }
    /*验证密码长度*/
    /*text:密码*/
    tool.keyCheck = function(text){
        if(text.length>=6&&text.length<=12){
            return true;
        }else{
            return false;
        }
    }
    /*loading*/
    tool.loading = {
        on:function(){
            $("#loading").show();
        },
        off:function(){
            $("#loading").hide();
        }
    }
