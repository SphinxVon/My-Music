/**
 * Created by qin on 2017/7/29.
 */
(function () {
    var list = document.querySelector('#music-menu .music-list ul');
    //1.初始化音乐列表和歌词
    init();
    var keepTime = 7*24*3600;
    var oli = list.querySelectorAll('li'),
        length = oli.length;
    var starPic = document.querySelector('.music-content .audio-disc .singer-pic img'),
        songName = document.querySelector('.music-content .audio .song-name'),
        singerName = document.querySelector('.music-content .audio .singer-name'),
        album = document.querySelector('.music-content .audio .album'),
        likeBtn = document.querySelector('.music-content .audio .control-tab1 .like-btn'),
        updownBtn = document.querySelector('#updown'),
        playBtn = document.querySelector('#wrap .music-content .audio .control-tab3 .play-state'),
        prev = document.querySelector('#wrap .music-content .audio .control-tab3 .prev'),
        next = document.querySelector('#wrap .music-content .audio .control-tab3 .next'),
        playMode = document.querySelector('#wrap .music-content .audio .control-tab3 .play-model'),
        currentTime = document.querySelector('#wrap .music-content .audio .control-tab2  .current-time'),
        totalTime = document.querySelector('#wrap .music-content .audio .control-tab2  .total-time'),
        progressBar = document.querySelector('#wrap .music-content .audio .control-tab2  .progress-bar'),
        progress = document.querySelector('#wrap .music-content .audio .control-tab2  .progress-bar #progress'),
        volumeBtn = document.querySelector('.music-content .audio .control-tab1 .volume-btn'),
        lyricCon = document.querySelector('#lyric-on-off .lyric-wrap .lyric-content ul');
    //当前播放的音乐序号
    var curIndex = getCookie( 'song-index' )?getCookie( 'song-index' ):0;
    //2.从cookie中获取上次播放的记录
    starPic.src = data[curIndex].star;
    audio.setAttribute('src',data[curIndex].src);
    songName.innerText = data[curIndex].name;
    singerName.innerText = data[curIndex].singer;
    album.innerText = data[curIndex].album;
    loadLyric(curIndex);
    //3.点击播放列表
    var now = new  Date();
    for (var i=0;i<length;i++){
        oli[i].i = i;
        oli[i].like = false;   //默认未标记喜欢
        oli[i].onclick = function () {
            if(new Date()-now>300){
                now = new  Date();
                play(this.i);
            }
         }
    }
    //4.点击收藏
    likeBtn.onclick = function (e) {
        e = e||window.event;
        if(oli[curIndex].like){
            addClass(this,'love1');                   //去除标记
            removesClass(oli[curIndex].querySelector('.like'),'active');
            oli[curIndex].like = false;
            // removeCookie('song'+curIndex+'-like');
        }else{
            removesClass(this,'love1');              //标记为喜爱
            addClass(oli[curIndex].querySelector('.like'),'active');
            oli[curIndex].like = true;
            // setCookie('song'+curIndex+'-like',true,keepTime);
        }
        e.cancelBubble = true;
        e.preventDefault();
    };
    //5.点击播放
    var on_off = true;
    playBtn.onclick = function (e) {
        e = e||window.event;
        if(on_off){
            this.className = 'play-state pause';
            play(curIndex);
        }else{
            this.className = 'play-state';
            oli[curIndex].className = '';
            starPic.parentNode.className = 'singer-pic'; //头像停止旋转
            audio.pause();
            on_off = true;
        }
        e.cancelBubble = true;
        e.preventDefault();
    };
    //6.点击上一首
    prev.onclick = function (e) {
        e = e||window.event;
        if(new Date()-now>300){
            now = new  Date();
            var last = curIndex;
            switch (playMode.model){
                case 'loop':
                    curIndex = (last-1)<0?oli.length-1:last-1;
                    audio.setAttribute('src',data[curIndex].src);  //设置要播放的音乐地址
                    play(curIndex);
                    break;          //循环模式下自动播放下一首
                case 'rand':
                    curIndex = Math.floor(Math.random()*length);
                    audio.setAttribute('src',data[curIndex].src);  //设置要播放的音乐地址
                    play(curIndex);
                    break;
                case 'single':
                    audio.setAttribute('src',data[curIndex].src);  //设置要播放的音乐地址
                    play(curIndex);
                    break;
            }
            var Mtop = (last-curIndex)*oli[0].offsetHeight;
            resetSize(Mtop);
        }
        e.cancelBubble = true;
        e.preventDefault();
    };
    //7.点击下一首
    next.onclick = function nextMusic(e) {
        e = e||window.event;
        if(new Date()-now>500){
            now = new  Date();
            var last = curIndex;
            switch (playMode.model){
                case 'loop':
                    curIndex = (last+1)%oli.length;
                    audio.setAttribute('src',data[curIndex].src);  //设置要播放的音乐地址
                    play(curIndex);
                    break;          //循环模式下自动播放下一首
                case 'rand':
                    curIndex = Math.floor(Math.random()*length);
                    audio.setAttribute('src',data[curIndex].src);  //设置要播放的音乐地址
                    play(curIndex);
                    break;
                case 'single':
                    audio.setAttribute('src',data[curIndex].src);  //设置要播放的音乐地址
                    play(curIndex);
                    break;
            }
            var Mtop = (last-curIndex)*oli[0].offsetHeight;
            resetSize(Mtop);
        }
        e.cancelBubble = true;
        e.preventDefault();
    };
    //8.点击播放模式
    var n = 0;
    playMode.model = 'loop';  //默认为循环播放模式
    playMode.onclick = function () {
        if(new Date()-now>300){
            now = new  Date();
            switch (n){
                case 0:
                    this.className = 'play-model rand';
                    playMode.model = 'rand';
                    break;    //随机模式
                case 1:
                    this.className = 'play-model single';
                    playMode.model = 'single';
                    break; //单曲循环
                case 2:
                    this.className = 'play-model loop';
                    playMode.model = 'loop';
                    break;   //循环模式
            }
            console.log(playMode.model);
            n = (n+1)%3;
        }
    };
    //9.设置开始播放时间
    audio.addEventListener(
        'timeupdate', nowTime
    );
    //10.设置播放总时间
    function load(){
        audio.addEventListener(
            'canplay',
            function(){
                totalTime.innerHTML = time( audio.duration ); // 总时间
            }
        );
    }
    //11.静音
    volumeBtn.off = true;
    volumeBtn.onclick = function (e) {
        e = e||window.event;
        if(e.target === volumeBtn){
            if(this.off){
                addClass(this,'mute');
                $('#volume').width(0);
                audio.volume = 0;
            }else{
                removesClass(this,'mute');
                $('#volume').width(20);
                audio.volume = 20/$('.volume-bar').width();
            }
            this.off = !this.off;
        }
        e.cancelBubble = true;
        e.preventDefault();
    };
    //12.改变进度条或音量

    drag($('#volume'),$('.volume-bar').width(),true);//调整音量
    drag($('#progress'),$('.progress-bar').width());//控制播放进度

    //13.同步歌词
    function loadLyric(n) {//加载歌词
        var lrcText = data[n].lrc;
        var lrcArr = lrcText.split('[').slice(1,lrcText.split('[').length);
        lyricCon.innerHTML = '';
        for(var i=0;i<lrcArr.length;i++){
            var arr = lrcArr[i].split(']');
            if(arr[1]){
                var time = arr[0].split('.');
                var ms = time[0].split(':')[0]*60 + time[0].split(':')[1]*1;
                var text = arr[1];
                var li = document.createElement('li');
                li.id = 'gc'+ms;
                li.innerHTML = text;
                lyricCon.appendChild(li);
            }
        }
        var curTime = 0;
        var oLi = lyricCon.querySelectorAll('li');
        var num = 10*oLi[0].offsetHeight;
        audio.addEventListener(
            'timeupdate',  // 在音频或视频 播放位置发生改变的时候触发
            function(){
                curTime = parseInt(this.currentTime);
                var curLi = document.getElementById('gc'+curTime);
                if(curLi){
                    for(var i=0;i<oLi.length;i++){
                        oLi[i].className = '';
                        oLi[i].index = i;
                    }
                    curLi.className = 'active';
                    if( curLi.offsetTop>=num){
                        moveByTime(lyricCon,{top:-oLi[0].offsetHeight*(curLi.index-10)},500);
                    }else{
                        moveByTime(lyricCon,{top:0},0);           //每次播放时，歌词位置都重置
                    }
                }
            }
        )
    }

    //14.歌词滚动
    var sTop = lyricCon.offsetTop;
    mousewheel(lyricCon,function (e) {
        e = e || window.event;
        var delta = e.wheelDelta|| -e.detail; //往上为正，往下为负
        delta<0?sTop += 15:sTop -= 15;
        sTop = Math.max(sTop,0);
        sTop = Math.min(sTop,lyricCon.offsetHeight-lyricCon.parentNode.offsetHeight);
        lyricCon.style.top = -sTop +'px';
        return false;
    });
    //15.歌曲结束
    audio.addEventListener('timeupdate',function (){
        if (audio.ended){
            starPic.parentNode.className = 'singer-pic';  //头像停止旋转
            next.click();
        }
    });
    //16.点击下载
    updownBtn.onclick = function () {
        this.href = data[curIndex].src;
        this.download = data[curIndex].name;
    };
    function downloadFile(url) {
        try{
            var elemIF = document.createElement("iframe");
            elemIF.src = url;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }catch(e){
            window.confirm("下载失败!");
        }
    }
    /*------------------------------------------------------------*/
    function play(index) {
        for(var i=0;i<length;i++){oli[i].className = '';}
        oli[index].className = 'active';
        starPic.src = data[index].star;
        songName.innerText = data[index].name;
        singerName.innerText = data[index].singer;
        album.innerText = data[index].album;
        addClass(starPic.parentNode,'rotate');    //头像开始旋转
        curIndex = index;               //当前播放的序号
        addClass(playBtn,'pause');      //对应点击播放
        on_off = false;
        audio.play();//开始播放
        nowTime();                                  //设置开始播放的时间
        load();
        loadLyric(curIndex);                        //加载当前播放音乐的歌词
        if(oli[curIndex].like){         //对应点击收藏
            removesClass(likeBtn,'love1');
            oli[curIndex].like=true;
        }else{
            removesClass(likeBtn,'love1');
            addClass(likeBtn,'love1');
            oli[curIndex].like=false;
        }
    }
    function init() {
        /*加载音乐列表*/
        for(var i=0;i<data.length;i++){
            var oLi = document.createElement('li');
            var oS1 = document.createElement('span');
            oS1.className = 'like';
            var oS2 = document.createElement('span');
            oS2.className = 'song-name';
            oS2.innerText = data[i].name;
            var oS3 = document.createElement('span');
            oS3.className = 'singer-name';
            oS3.innerText = data[i].singer;
            oLi.appendChild(oS1);
            oLi.appendChild(oS2);
            oLi.appendChild(oS3);
            list.appendChild(oLi);
        }
    }
    function resetSize(_top) {//点击上/下一首歌曲时改变滚动条和列表歌曲显示的位置
        var oWrap =  document.querySelector('#music-menu .music-wrap .music-list'),
            oCon = document.querySelector('#music-menu .music-wrap .music-list ul'),
            oScrollBar = document.querySelector('#music-menu .music-wrap .scroll-bar'),
            oScroll = document.querySelector('#scroll');
        var cTop = oCon.offsetTop;
        var sTop = oScroll.offsetTop;
        var cTMax = oCon.clientHeight - oWrap.clientHeight;
        var sTMax = oScrollBar.clientHeight - oScroll.clientHeight;
        cTop = cTop+ _top;
        cTop = Math.max(cTop,-cTMax);
        cTop = Math.min(0,cTop);
        oCon.style.top =cTop + 'px';
        oCon.style.transition = 'top .5s';
        var prop = _top/sTMax;
        sTop = sTop + -prop*cTMax;
        sTop = Math.max(sTop,0);
        sTop = Math.min(sTop,sTMax);
        oScroll.style.top = sTop  +'px';
        oScroll.style.transition = 'top .5s';
    }
    //获取当前的时间
    function nowTime(){
        currentTime.innerHTML = time( audio.currentTime ); // 开始时间
        var scale = audio.currentTime / audio.duration;
        progress.style.width = scale * (progressBar.offsetWidth-6) + 'px';
    }
    // 时间格式转换
    function time( changeTime ){ // 把3213.45432 转换成 00:00
        changeTime = parseInt( changeTime );
        //var h = Math.floor( changeTime/3600 ); //时
        var m = zero(Math.floor( changeTime%3600/60 )); //分
        var s = zero(Math.floor( changeTime%60 )); // 秒
        return m+':'+s;
    }
    // 个位数补0
    function zero(num){
        return num<10?'0'+num:''+num;
    }

    function drag($obj,$maxW,vol) {//拖动进度条或者音量条
        $obj.mousedown(function (e) {
            var $dx = e.pageX;
            var $w = $obj.width();
            $(document).mousemove(function (e) {
                var $_x = e.pageX - $dx;
                $w += $_x;
                $w = Math.max(0,$w);
                $w = Math.min($w,$maxW);
                $obj.width($w);
                if(vol){//音量控制
                    audio.volume = $w/$maxW;
                    ( audio.volume==0)?addClass(volumeBtn,'mute'):removesClass(volumeBtn,'mute');
                }else{//播放进度控制
                    if(($w/$maxW)*audio.duration<=audio.seekable.end(0)){
                        audio.currentTime = ($w/$maxW)*audio.duration;
                    }else{
                        audio.currentTime = audio.buffered.end(audio.buffered.length-1);
                    }
                }
                $dx = e.pageX;
            });
            $(document).mouseup(function () {
                $(this).unbind("mousemove");
                $(this).unbind("mouseup");
            });
        })
    }
    window.onbeforeunload = function b(){
        setCookie('song-index',curIndex,keepTime);
    };

})();