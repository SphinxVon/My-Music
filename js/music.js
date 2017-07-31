/**
 * Created by qin on 2017/7/29.
 */
(function () {
    var list = document.querySelector('#music-menu .music-list ul');
    //1.初始化音乐列表和歌词
    init();
    var oli = list.querySelectorAll('li'),
        length = oli.length;
    var starPic = document.querySelector('.music-content .audio-disc .singer-pic img'),
        songName = document.querySelector('.music-content .audio .song-name'),
        singerName = document.querySelector('.music-content .audio .singer-name'),
        album = document.querySelector('.music-content .audio .album'),
        likeBtn = document.querySelector('.music-content .audio .control-tab1 .like-btn'),
        playBtn = document.querySelector('#wrap .music-content .audio .control-tab3 .play-state'),
        prev = document.querySelector('#wrap .music-content .audio .control-tab3 .prev'),
        next = document.querySelector('#wrap .music-content .audio .control-tab3 .next'),
        playMode = document.querySelector('#wrap .music-content .audio .control-tab3 .play-model'),
        currentTime = document.querySelector('#wrap .music-content .audio .control-tab2  .current-time'),
        totalTime = document.querySelector('#wrap .music-content .audio .control-tab2  .total-time'),
        progressBar = document.querySelector('#wrap .music-content .audio .control-tab2  .progress-bar'),
        progress = document.querySelector('#wrap .music-content .audio .control-tab2  .progress-bar #progress'),
        volumeBtn = document.querySelector('.music-content .audio .control-tab1 .volume-btn');
    //当前播放的音乐序号
    var curIndex = getCookie( 'song-index' )?getCookie( 'song-index' ):0;
    //2.从cookie中获取上次播放的记录
    getCookie( 'song-src' )?audio.setAttribute('src',getCookie( 'song-src' )):audio.setAttribute('src',data[0].src);
    getCookie('star-pic')?starPic.src= getCookie('star-pic'):starPic.src = data[0].star;
    getCookie('song-name')?songName.innerText= getCookie('song-name'):songName.innerText = data[0].name;
    getCookie('singer-name')?singerName.innerText= getCookie('singer-name'):singerName.innerText = data[0].singer;
    getCookie('album-name')?album.innerText= getCookie('album-name'):album.innerText = data[0].album;
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
        if(oli[curIndex].like){
            addClass(this,'love1');                   //去除标记
            removesClass(oli[curIndex].querySelector('.like'),'active');
            oli[curIndex].like = false;
        }else{
            removesClass(this,'love1');              //标记为喜爱
            addClass(oli[curIndex].querySelector('.like'),'active');
            oli[curIndex].like = true;
        }
        e.cancelBubble = true;
        e.preventDefault();
    };
    //5.点击播放
    var on_off = true;
    playBtn.onclick = function (e) {
        if(on_off){
            this.className = 'play-state pause';
            play(curIndex);
        }else{
            this.className = 'play-state';
            oli[curIndex].className = '';
            starPic.parentNode.className = 'singer-pic';
            audio.pause();
            on_off = true;
        }
        e.cancelBubble = true;
        e.preventDefault();
    };
    //6.点击上一首
    prev.onclick = function (e) {
        if(new Date()-now>300){
            now = new  Date();
            var last = curIndex;
            curIndex = (last-1)<0?oli.length-1:last-1;
            play(curIndex);
            var Mtop = (last-curIndex)*oli[0].offsetHeight;
            resetSize(Mtop);
        }
        e.cancelBubble = true;
        e.preventDefault();
    };
    //7.点击下一首
    next.onclick = function (e) {
        if(new Date()-now>500){
            now = new  Date();
            var last = curIndex;
            curIndex = (last+1)%oli.length;
            var Mtop = (last-curIndex)*oli[0].offsetHeight;
            play(curIndex);
            resetSize(Mtop);
        }

        e.cancelBubble = true;
        e.preventDefault();
    };
    //8.点击播放模式
    var n = 0;
    playMode.onclick = function () {
        if(new Date()-now>300){
            now = new  Date();
            switch (n){
                case 0:randModel(this);break;    //随机模式
                case 1:singleModel(this);break; //单曲循环
                case 2:loopModel(this);break;   //循环模式
            }
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
    volumeBtn.onclick = function () {

    };
    //12.改变进度条或音量
    drag($('#volume'),$('.volume-bar').width(),true);//调整音量
    drag($('#progress'),$('.progress-bar').width());//控制播放进度
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
                if(vol){
                    audio.volume = $w/$maxW;
                }else{

                    if(($w/$maxW)*audio.duration<=audio.seekable.end(0)){
                        audio.currentTime = ($w/$maxW)*audio.duration;
                    }else{
                        // audio.currentTime = audio.buffered.end(audio.buffered.length-1);
                    }
                    // console.log(($w/$maxW)*audio.duration+','+audio.duration+','+audio.currentTime)
                    console.log("Start: " + audio.buffered.start(0)
                        + " End: " + audio.buffered.end(0));
                    console.log( "Length: " + audio.seekable.length );
                    console.log( "Start: " + audio.seekable.start(0) + " End: " + audio.seekable.end(0))
                }
                $dx = e.pageX;

            });
            $(document).mouseup(function () {
                $(this).unbind("mousemove");
                $(this).unbind("mouseup");
            });
        })
    }
    function play(index) {
        for(var i=0;i<length;i++){oli[i].className = '';}
        oli[index].className = 'active';
        starPic.src = data[index].star;
        songName.innerText = data[index].name;
        singerName.innerText = data[index].singer;
        album.innerText = data[index].album;
        addClass(starPic.parentNode,'rotate');
        curIndex = index;               //当前播放的序号
        addClass(playBtn,'pause');      //对应点击播放
        on_off = false;
        audio.setAttribute('src',data[index].src);  //设置要播放的音乐地址
        audio.play();                               //开始播放
        nowTime();                                  //设置开始播放的时间
        load();
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
        /*加载歌词*/
        var lrcJson = {
            text: [],time:[]
        };
        lrcJson.text = data[0].lrc.match(/[\u4E00-\u9FA5A-Za-z]+/g);
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
    function loopModel(obj) {
        obj.className = 'play-model loop';
    }
    function randModel(obj) {
        obj.className = 'play-model rand';
    }
    function singleModel(obj) {
        obj.className = 'play-model single';
    }
})();