/**
 * Created by qin on 2017/6/25.
 */
        // console.log('ie8 及以下版本生效');
        document.getElementsByClassName = document.getElementsByClassName || function (className,element) {
            var children = (element||document).getElementsByTagName('*');//通过标签获取所有的子元素节点
            var elements = new Array(); //创建数组，用于存放获取到的所有类名
            for(var i = 0; i<children.length; i++){
                var child = children[i];
                var classNames;
                if(child.className){
                    classNames = child.className.split(' ');//将每一个子元素的类名 通过空格符分割 保存到数组中
                    for(var j=0; j<classNames.length;j++){
                        if(classNames[j] == className){//将目标类名与类名数组中的每一个类名比较
                            elements.push(child);//找到类名相同则将该元素存储
                            break;//在当前元素中找到，则跳出此次循环，进入下一个元素的判断
                        }
                    }
                }
            }
            return elements;
        };
        /*添加及移除类*/
        addClass = function (element,name) {//可同时添加多个类
            var names = name.split(' ');
            var addName = new Array();
            for(var i =0;i<names.length;i++){
                if(element.className!== names[i]){
                    addName.push( names[i]);
                }
            }
            for(var j=0;j<addName.length;j++){
                element.className += ' '+addName[j];
            }
        };
        replaceClass = function (element,name,rename) {//一次只能移除一个
            var classNames = element.className.split(' ');
            for(var i=0;i<classNames.length;i++){
                if(name.replace(/(^\s*)|(\s*$)/g,"") === classNames[i]){
                    classNames.splice(i,1,rename);
                }
            }
            element.className = classNames.join(' ');
        };
        removesClass = function (element,name) {//一次移除多个
            var names = name.split(' ');
            var classNames = element.className.split(' ');
            for(var j=0;j<names.length;j++) {
                for(var i=0;i<classNames.length;i++){
                    if(names[j]===classNames[i]){
                        classNames.splice(i,1);
                        break;
                    }
                }
            }
            element.className = classNames.join(' ');
        };
        /*随机色*/
        getRandomColor = function () {//返回rgba
            var r = Math.floor(Math.random()*255+1);
            var g = Math.floor(Math.random()*255+1);
            var b = Math.floor(Math.random()*255+1);
            var a = .8;
            return 'rgba('+r+','+g+','+b+','+a+')';
        };
        randomColor=  function () {//返回十六进制色
            var c='#';
            for(var i=0;i<6;i++){
                c += parseInt(Math.random()*16).toString(16)+'';
            }
            return c;
        };
        RanColor = function () {//返回16进制色
            var x = '#'+(~~Math.floor(Math.random()*(1<<24))).toString(16);
            return x;
        };
        /*获取最终样式，兼容ie*/
        getCSSJson = function (obj) {
            return obj.currentStyle || getComputedStyle(obj);
        };
        /*速度版运动框架,适用于数值类型样式变化，例如width,left,marginLeft...*/
        moveBySpeed = function(obj,attr,target,speed) {
            window.requestAnimationFrame = window.requestAnimationFrame || function (fn) {setTimeout(fn,1000/60);};
            window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;
            var cssJson = obj.currentStyle || getComputedStyle(obj);
            var start = parseFloat(cssJson[attr]);
            var flag = start>target;
            speed = parseFloat(speed);
            target = parseFloat(target);
            (function fn() {
                start += speed;
                (flag?start<=target:start>=target)?start=target:requestAnimationFrame(fn);
                obj.style[attr] = start +'px';
            })();
        };
        /*时间版运动插件,在规定时间内完成运动*/
        function moveByTime(obj,json,time,callback) {//time以毫秒计
            window.requestAnimationFrame = window.requestAnimationFrame || function (a) {return setTimeout(a,1000/60);}
            window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;
            var cssJson = obj.currentStyle||getComputedStyle(obj);
            var start = {},s={};
            for(var key in json){
                start[key] = parseFloat(cssJson[key]);
                if(json[key]===start[key]){
                    delete start[key];
                    delete json[key];
                }
            }
            var prop,sTime = new Date();
            (function fn() {
                prop = (new Date() - sTime)/time;
                prop>=1?prop=1:requestAnimationFrame(fn);
                for(var key in start){
                    if(key==='opacity'){
                        obj.style[key] = (json[key]-start[key])*prop+start[key];
                        obj.style.filter = "alpha(opacity="+ (json[key]-start[key])*prop+start[key]*100 +")";
                    }else{
                        obj.style[key] = (json[key]-start[key])*prop+start[key]+'px';
                    }
                }
                if(prop===1){
                    callback && callback.call(obj);
                }
            })();
        }
        /*去掉首尾空格符*/
        trim = function(str) {//去掉开始和结尾空格符
            return str.replace(/(^\s*)|(\s*$)/g,"");
        };
        mousewheel = function (obj,scrollFn) {//鼠标滚动事件兼容
            obj.onmousewheel===null?obj.onmousewheel=scrollFn:obj.addEventListener('DOMMouseScroll',scrollFn);
        };
