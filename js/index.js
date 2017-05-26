window.onload = function(){
	mv.app.clearTxtValue();
	mv.app.select();
	mv.app.runPic();
	mv.app.changePic();
}


var mv = {};
mv.tools = {};
mv.tools.getId = function (id){
	return document.getElementById(id);
}
mv.tools.getClassName = function(oParent,clsName){
	var obj = oParent.getElementsByTagName('*');
	var arr = [];
	for (var i = 0; i < obj.length; i++) {
		if(obj[i].className == clsName){
			arr.push(obj[i]);
		}
	}
	return arr;
}
mv.tools.getStyle = function(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[atrr];
	}else{
		getComputedStyle(obj,false)[atrr];
	}
}
mv.tools.addEvent = function(obj,event,callback){
	if(obj.addEventListener){
		obj.addEventListener(event,callback,false);
	}else if (obj.attachEvent) {
		obj.attachEvent("on"+event,callback);
	}
}


mv.ui = {};
mv.ui.clearValue = function(obj,value){
	mv.tools.addEvent(obj,"focus",function(){
		if(this.value == value){
			this.value = "";
		}
	});
	mv.tools.addEvent(obj,"blur",function(){
		if(this.value == ""){
			this.value = value;
		}
	});
}
mv.ui.fadeIn = function(obj){
	if(obj.timer){
		clearInterval(obj.timer);
	}
	var num = 0;
	obj.timer = setInterval(function(){
		num += 10;
		obj.style.opacity = num/100;
		obj.style.filter = 'alpha(opacity:'+num+')';
		if (num >= 100) {
			clearInterval(obj.timer);
			obj.timer = null;
		}
	},50);
}

mv.ui.fadeOut = function(obj){
	if(obj.timer){
		clearInterval(obj.timer);
	}
	var num = 100;
	obj.timer = setInterval(function(){
		num -= 10;
		obj.style.opacity = num/100; 
		obj.style.filter = 'alpha(opacity:'+num+')';
		if (num <= 0) {
			clearInterval(obj.timer);
			obj.timer = null;
		}
	},50);
}

mv.app = {};
// 清空 文本框默认值
mv.app.clearTxtValue = function(){
	var search_txt = mv.tools.getId("search_txt");
	var search_txt_bottom = mv.tools.getId("search_txt_bottom");
	mv.ui.clearValue(search_txt,"Search website");
	mv.ui.clearValue(search_txt_bottom,"Search website");
}
//banner图片淡入淡出
mv.app.changePic = function(){
	var ad = mv.tools.getId("ad");
	var aLi = ad.getElementsByTagName("li");
	var num = 0;
	ad.timer = setInterval(function(){
		for (var i = 0; i < aLi.length; i++) {
			mv.ui.fadeOut(aLi[i]);
		}
		mv.ui.fadeIn(aLi[num]);
		num++;
		if(num >= aLi.length){
			num = 0;
		}
	},3000);
}
// 排序 下拉菜单
mv.app.select = function(){
	var oDl = mv.tools.getId("sort");
	var aDd = oDl.getElementsByTagName("dd");
	var oUl = oDl.getElementsByTagName("ul");
	
	for (var i = 0; i < aDd.length; i++) {
		aDd[i].index = i;
		mv.tools.addEvent(aDd[i],"click",function(e){
			for (var i = 0; i < oUl.length; i++) {
				oUl[i].style.display="none";
			}
			oUl[this.index].style.display="block";   //显示当前下拉菜单

			var oSpan = this.getElementsByTagName("span")[0];
			var aLi = oUl[this.index].getElementsByTagName("li");
			for (var i = 0; i < aLi.length; i++) {
				mv.tools.addEvent(aLi[i],"mouseover",function(){
					this.className = "active";
				});
				mv.tools.addEvent(aLi[i],"mouseout",function(){
					this.className = "none";
				});
				mv.tools.addEvent(aLi[i],"click",function(e){
					this.parentNode.style.display="none";
					oSpan.innerHTML = this.innerHTML;
					//阻止事件冒泡-dd
					var e = e || window.event;
					if(e.cancelBubble){
						e.cancelBubble = true;
					}else if(e.stopPropagation){
						e.stopPropagation();
					}
									
				});
			}


			//阻止事件冒泡-document
			var e = e || window.event;
			if(e.cancelBubble){
				e.cancelBubble = true;
			}else if(e.stopPropagation){
				e.stopPropagation();
			}
		});
		mv.tools.addEvent(document,"click",function(){
			for (var i = 0; i < oUl.length; i++) {
				oUl[i].style.display="none";
			}
		});
	}
}
//无缝滚动图片
mv.app.runPic = function(){
	var wrap = mv.tools.getId("scrollListWrap_r");
	var prev = mv.tools.getClassName(wrap,"prev")[0];
	var next = mv.tools.getClassName(wrap,"next")[0];
	var oUl = wrap.getElementsByTagName("ul")[0];
	oUl.innerHTML += oUl.innerHTML;
	var aLi = oUl.getElementsByTagName("li");
	oUl.style.width = aLi[0].offsetWidth * aLi.length + "px";


	var speed = 0;
	var timer = null;
	var iNow = 0;
	//var num = 1;
	mv.tools.addEvent(prev,"click",function(){
		clearInterval(timer);
		if(iNow == 0){
			oUl.style.left = -oUl.offsetWidth/2 + 'px';
			iNow = aLi.length/2;
		}
		var oldDes = -iNow * aLi[0].offsetWidth;
		var newDes = (-iNow+1)* aLi[0].offsetWidth;
		speed = 10;
		timer = setInterval(function(){
			oldDes += speed;
			oUl.style.left = oldDes + 'px';
			if(oldDes >= newDes){
				clearInterval(timer);
			}
		},100);
		iNow--;
	});
	mv.tools.addEvent(next,"click",function(){
		clearInterval(timer);
		if(iNow == aLi.length/2){
			oUl.style.left = '0px';
			iNow = 0;
		}
		var oldDes = -iNow * aLi[0].offsetWidth;
		var newDes = (-iNow-1)* aLi[0].offsetWidth;
		speed = -10;
		timer = setInterval(function(){
			oldDes += speed;
			oUl.style.left = oldDes + 'px';
			if(oldDes <= newDes){
				clearInterval(timer);
			}
		},100);
		iNow++;
	});
}














