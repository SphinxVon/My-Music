# My-Music
PC端音乐播放器
在线浏览，由于使用的是MP3文件不是线上音乐接口，初始加载速度需要一定的时间。
https://sphinxvon.github.io/My-Music/
该项目主要是出于个人喜好，熟练es5与H5技术。
对于加载缓慢问题，有一下几点改进方法：
1.通过CSS Sprites技术将小图标整合，减少dom与js请求次数
2.mp3音乐文件通过ajax技术向公开的音乐接口发送请求，并异步加载
