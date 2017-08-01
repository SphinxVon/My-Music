/**
 * Created by qin on 2017/7/28.
 */
(function () {
    var flag =  flag1 = flag2= true;
    //背景图src
    var $src = getCookie( 'bg-src' )?getCookie( 'bg-src' ):'img/people-1.jpg';
    $('#wrap').css("background-image","url('./"+$src+"')");
    move($('.face-btn'));//拖动皮肤设置盒子
    move($('.music-content'));//拖动音乐盒
    // move($('.music-list'));//拖动音乐播放列表
  /*  drag($('#volume'),$('.volume-bar').width());//调整音量
    drag($('#progress'),$('.progress-bar').width());//控制播放进度
*/

    /*显示/隐藏换肤选项*/
   $('#set-btn').click(flag,function (e) {
       e.stopPropagation();
       e.preventDefault();
       flag?$('.skin-content').slideDown():$('.skin-content').slideUp();
       flag = !flag;
   });
    /*切换不同皮肤主题*/
   $('.skin-content').find('a').click(function () {
      $(this).addClass('active').siblings().removeClass('active');
      switch ($(this).attr("href")){
          case '#carton':$('#carton').fadeIn().siblings().fadeOut();break;
          case '#people':$('#people').fadeIn().siblings().fadeOut();break;
          case '#scenery':$('#scenery').fadeIn().siblings().fadeOut();break;
      }
   });
   /* 更换皮肤*/
   $('.atlas').children('li').click(function () {
       $src = $(this).children('img').attr("src");
       $('#wrap').css("background-image","url('./"+$src+"')");
       setCookie('bg-src' , $src , 3600*24);//设置背景图的cookie,时间为1天
   });


   /*显示/隐藏音乐播放列表*/
   $('#music-menu').click(function (e) {
       if(e.target.id === 'music-menu'){
           flag1?$('.music-wrap').slideDown(function () {
               moveScroll($('.music-list'),$('.music-list').children('ul'),$('.music-wrap').children('.scroll-bar'),$('#scroll'));
           }):$('.music-wrap').slideUp();
           flag1 = !flag1;
       }
   });
   /*显示/隐藏歌词*/
    $('#lyric-on-off').click(function (e) {
        if(e.target.id === 'lyric-on-off'){
            flag2?$('.lyric-wrap').animate({width: '400px'}, "slow"):$('.lyric-wrap').animate({width: '0'}, "slow");
            flag2 = !flag2;
        }
    });
   function move($obj,w) {//拖动盒子
       var $dx,$dy,$_x,$_y;
       $obj.mousedown(function (e) {
           $dx = e.pageX;
           $dy = e.pageY;
           /*不可通过其他子元素拖动*/
           var tar = e.target.className;
           if(tar=='setting'||tar=='skin-content'||tar=='music-content'||tar=='music-list'){
               $(document).mousemove(function (e) {
                   $_x = e.pageX - $dx;
                   $_y = e.pageY - $dy;
                   var $left = $obj.position().left+ $_x;
                   var $top = $obj.position().top + $_y;
                   $obj.css({"left":$left+'px',"top":$top+'px'});
                   $dx = e.pageX;
                   $dy = e.pageY;
               });
               $(document).mouseup(function () {
                   $(this).unbind("mousemove");
                   $(this).unbind("mouseup");
               });
           }
       })
   }

   function moveScroll($wrap,$con,$scrollBar,$scroll,$mTop) {//自定义滚动条
       $scroll.height($wrap.height()/$con.height()* $scrollBar.height());
       if($con.height()==0||$scroll.height()>=$scrollBar.height()){
           $scrollBar.hide();
       }else{$scrollBar.show();}
       var $maxT = $scrollBar.height() - $scroll.height();//滚动条最大top值
       var $sTop = $mTop?$mTop:$scroll.position().top;
       // console.log($wrap.height()+','+$con.height()+','+$scrollBar.height());
       $scroll.mousedown(function (e) {
           var dy = e.clientY;
           $sTop = $mTop?$mTop:$scroll.position().top;
           $(document).mousemove(function (e) {
               e = e || window.event;
               var _y = e.clientY - dy;
               var _top = $sTop + _y;
               _top = Math.max(_top,0);
               _top = Math.min(_top,$maxT);
               $scroll.css("top",_top);
               var prop = _top/($scrollBar.height()-$scroll.height());//滚动条移动比
               $con.css("top",-prop*($con.height()-$wrap.height()));//内容滚动距离=滚动比*可移动距离
               return false;
           })
           document.onmouseup = function () {
               $(this).unbind("mousemove");
           }
       });
       /*Jquery兼容鼠标滚轮事件*/
       $wrap.on("mousewheel DOMMouseScroll", function (e) {
         /*  var $delta = e.originalEvent.wheelDelta  ||
              e.originalEvent.detail ;*/
           var $delta = 0;
           if ( e.wheelDelta ){ $delta = -e.wheelDelta }      // chrome & ie
           else if ( e.deltaY     ){ $delta = e.deltaY }// firefox
           // else if( e.wheelDeltaY ) { $delta = e.wheelDeltaY }
           else {console.log('get delta,have somethings wrong...');}
           $sTop = $scroll.position().top;
           $delta<0?$sTop += 15:$sTop -= 15;
           var _top = $sTop;
           _top = Math.max(_top,0);
           _top = Math.min(_top,$maxT);
           $scroll.css("top",_top);
           var prop = _top/($scrollBar.height()-$scroll.height());//滚动条移动比
           $con.css("top",-prop*($con.height()-$wrap.height()));//内容滚动距离=滚动比*可移动距离
           return false;
       });

   }
})();