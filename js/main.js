	var readFn={
        anRun:function(){
            var anRunDelay=setTimeout(function(){
              $("body").addClass("anActive");  
            },50);
        
        }
    }
	/*滚屏*/
    var scrollArray=[];
	//alert(window.devicePixelRatio)
    $(document).ready(function(){
        $.each(readFn,function(index,fn){
            fn();
        });
    });
    
    /*自适应处理*/
	function size(){
		var w=$(window).width();
		if(navigator.userAgent.indexOf("WindowsWechat")>-1&&$(window).width()>360){
        w=360;
    }
        return w/750;
		}
	function getH(){
		if(navigator.userAgent.indexOf("WindowsWechat")>-1&&$(window).width()>360){
			$("#all").css({
				"float":"none",
				"box-shadow":"0px 0px 10px 5px rgba(0,0,0,0.3)",
				"position": "relative",
				"left":"180px"
				});
            return 1452;
        }else{
            return $(window).height()*(750/$(window).width());
        }
		}
    function resize(){
		if(window.i8){
			$("#all").css({
			  "zoom":size(),
              "height":getH()
});
			}else{
			$("#all").css({
              "-webkit-transform":"scale("+size()+")",
			  "transform":"scale("+size()+")",
              "height":getH()
});	
				}
		
		}
    /*先执行一次*/
    readFn.rs=resize;
    /*屏幕有变动的时候再执行*/
    $(window).on("resize",resize);
    
    /************通用方法*************/
    (function(){
    /*滚屏*/
    $(".wrap").each(function(){
        var newScroll=new IScroll('#'+$(this).attr("id"), { probeType: 3 });
        scrollArray.push(newScroll);
        $("img").on("load",function(){
    $.each(scrollArray,function(index,sc){
        sc.refresh();
    })
});
    });
     /*显示密码*/
    $(".password .rightIcon").unbind("tap").bind("tap",function(){
        if($(this).parents(".input_module").find("input").attr("type")=="password"){
            $(this).parents(".input_module").find("input").attr("type","text");
            $(this).parents(".input_module").addClass("show");
            $(this).css("color","#333");
        }else{
            $(this).parents(".input_module").find("input").attr("type","password");
            $(this).parents(".input_module").removeClass("show");
            $(this).css("color","#8ea7c8");
        }
    });
    
      /*获取验证码*/
    $(".getCode .rightButton").unbind("tap").bind("tap",function(){
        if($(this).parents(".input_module").attr("lock")=="1"){
            return false;
        }
        /*手机号*/
        var phone=$(this).parents(".input_module").find("input").val();
        if(!phone){
            tool.pop("请填写手机号");
            return false;
        }
        if(!tool.phoneCheck(phone)){
            tool.pop("手机号格式有误");
            return false;
        }
        $(this).parents(".input_module").attr("lock","1");
        var that=this;
        var clock=0;
        var url = '';
        if($(this).attr("id") =='forgetsendCode'){
            url = "/用户接口/发送验证码/old";
        }else{
            url = "/用户接口/发送验证码";
        }
        /*先弹图片验证码*/
        tool.picCode(function(code){/*图片验证码通过后发送*/
            $.post(url,{"手机号":phone,"验证码":code},function(json){
            json = eval("("+json+")");
            if(json.状态==200){
                var codeDelay=setInterval(function(){
                    if(clock<60){
                        clock++;
                        $(that).html("重新发送"+(60-clock)+"S");
                        $(that).addClass("disable");
                    }else{
                        $(that).parents(".input_module").attr("lock","0");
                        $(that).html("获取验证码");
                        $(that).removeClass("disable");
                        clearInterval(codeDelay);
                    }
                },1000);

            }else{
                tool.pop(json.状态说明);
                $(that).parents(".input_module").attr("lock","0");
                        $(that).html("获取验证码");
                        $(that).removeClass("disable");
            }
        });

        },function(){
            $(that).parents(".input_module").attr("lock","0");
        });
        
    }); 
    /*往底部*/
    $("#toBottom").unbind("tap").bind("tap",function(){
        $.each(scrollArray,function(index,point){
            point.scrollTo(0,point.maxScrollY,1000);
        });
    });
    /*选年月*/
    $(".input_module .dateSelect.year").unbind("change").bind("change",function(){
        $(this).parents(".input_module").find(".dateInput.year").html($(this).val()+"年");
    });
    $(".input_module .dateSelect.month").unbind("change").bind("change",function(){
        $(this).parents(".input_module").find(".dateInput.month").html($(this).val()+"月");
    });
    })();
    /************工具方法*************/
    var tool = {};
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
        $("#pop #popButton").unbind("tap").bind("tap",function(){
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
    /*获取图片验证码*/
    tool.picCode=function(success,cancel){
        var url="/用户接口/生成图形验证码";/*获取验证码*/
        $("#codePop #codePic").attr("src",url);
        $("#codePop").show();
        $("#popBg").show();
        $("#codePop #popButton").unbind("tap").bind("tap",function(){
            var result=$("#codePop #picCode input").val();
            if(!result){
                return false;
            }
            if(success){
              success(result);  
            }
            $("#codePop").hide();
            $("#popBg").hide();
            $("#codePop #picCode input").val("");
        });
        $("#codePop #codePic").unbind("tap").bind("tap",function(){
            $("#codePop #codePic input").attr("src",url+"?_="+new Date().getTime());
        });
        $("#popBg").unbind("tap").bind("tap",function(){
            if(cancel){
                cancel();
            };
            $("#codePop").hide();
            $("#popBg").hide();
            $("#codePop #picCode input").val("");
        });
    }
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
    /*验证身份证*/
    /*text:身份证号*/
    tool.idCodeCheck = function(text){
        return /(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(text);
    }
    /*图片转码*/
    tool.pic =function(file,fn) {
            var reader = new FileReader();
            reader.onload = function(e) {
                fn(e.target.result);
            };
            reader.readAsDataURL(file.target.files[0]);
        };
    /*下方弹出窗*/
    tool.bottomPop = function(fn,cancel,cancelFn){
		if(cancel){
			$("#popBottom #popBottomCancel").text(cancel);
			}else{
				$("#popBottom #popBottomCancel").text("取消");
				}
        $("#popBottom").show();
        $("#popBottom #popBottomFinish").unbind("tap").bind("tap",function(){
            if(fn){fn()}
            $("#popBottom").hide();   
        });	
		$("#popBottom #popBottomCancel").unbind("tap").bind("tap",function(){
            if(cancelFn){cancelFn()}
            $("#popBottom").hide();   
        });	
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
